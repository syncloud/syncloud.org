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
APACHE_SRC="$STAGE/config/$ENV/apache.conf"
APACHE_SITE=/etc/apache2/sites-available/syncloud.org.conf

[ -f "$APACHE_SRC" ] || { echo "missing $APACHE_SRC" >&2; exit 1; }
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

install -m 0644 "$APACHE_SRC" "$APACHE_SITE"
a2ensite syncloud.org >/dev/null 2>&1 || true
a2enmod ssl rewrite >/dev/null 2>&1 || true
apache2ctl configtest
systemctl reload apache2 || systemctl restart apache2
