#!/bin/bash
set -ex

if [ "$#" -ne 2 ]; then
    echo "usage: $0 <version> <env: uat|prod>" >&2
    exit 1
fi
VERSION=$1
ENV=$2

SITE_DIR=/var/www/syncloud.org
STAGE=/tmp/syncloud.org

[ -d "$STAGE/web" ] || { echo "missing $STAGE/web" >&2; exit 1; }

mkdir -p "$SITE_DIR/.well-known"

TARGET="$SITE_DIR/$VERSION"
rm -rf "$TARGET"
mkdir -p "$TARGET"
cp -r "$STAGE/web/." "$TARGET/"
chown -R ubuntu:ubuntu "$TARGET"

ln -sfn "$TARGET" "$SITE_DIR/current"

cd "$SITE_DIR"
ls -1d [0-9]* 2>/dev/null | sort -n | head -n -5 | xargs -r rm -rf

install -d /etc/caddy/conf.d
install -m 0644 "$STAGE/config/caddy/syncloud.org.caddy" /etc/caddy/conf.d/syncloud.org.caddy
docker exec caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile 2>/dev/null || true
