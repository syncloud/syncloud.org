#!/bin/bash
set -ex

if [ "$#" -ne 1 ]; then
    echo "usage: $0 <version>" >&2
    exit 1
fi
VERSION=$1

SITE_DIR=/var/www/syncloud.org
STAGE=/tmp/syncloud.org

[ -d "$STAGE/web" ] || { echo "missing $STAGE/web" >&2; exit 1; }
[ -f "$STAGE/backend/api" ] || { echo "missing $STAGE/backend/api" >&2; exit 1; }

mkdir -p "$SITE_DIR/.well-known"
chown ubuntu:ubuntu "$SITE_DIR"

TARGET="$SITE_DIR/$VERSION"
rm -rf "$TARGET"
mkdir -p "$TARGET"
cp -r "$STAGE/web/." "$TARGET/"
chown -R ubuntu:ubuntu "$TARGET"

ln -sfn "$TARGET" "$SITE_DIR/current"

cd "$SITE_DIR"
ls -1d [0-9]* 2>/dev/null | sort -n | head -n -5 | xargs -r rm -rf

install -d "$SITE_DIR/bin"
install -m 0755 "$STAGE/backend/api" "$SITE_DIR/bin/api"
install -m 0644 "$STAGE/config/api.env" "$SITE_DIR/api.env"
install -m 0644 "$STAGE/deploy/syncloud.org-api.service" /etc/systemd/system/syncloud.org-api.service
systemctl daemon-reload
systemctl enable syncloud.org-api
systemctl restart syncloud.org-api

install -d /etc/caddy/conf.d
install -m 0644 "$STAGE/config/caddy/syncloud.org.caddy" /etc/caddy/conf.d/syncloud.org.caddy
docker exec caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker exec caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
