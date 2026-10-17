#!/bin/bash
set -ex

source "$(dirname "$0")/ssh.sh"

if ! command -v curl >/dev/null; then
    apt-get update
    apt-get install -y curl ca-certificates
fi

HOST=$(echo "$DEPLOY_URL" | sed -E 's#https?://([^/:]+).*#\1#')
if ! getent hosts "$HOST" >/dev/null 2>&1; then
    ip=$(getent hosts "$DEPLOY_HOST" | awk '{print $1}')
    [ -n "$ip" ] && echo "$ip $HOST" >> /etc/hosts
fi

fail() { echo "$1"; exit 1; }
probe() { curl -k -s -o /dev/null -w "%{$2}" "$DEPLOY_URL$1"; }
robots_tag() { curl -k -s -D - -o /dev/null "$DEPLOY_URL$1" | tr -d '\r' | grep -i '^x-robots-tag:' || true; }
expect_status() { got=$(probe "$1" http_code); [ "$got" = "$2" ] || fail "$1 returned $got, expected $2"; }
expect_type() { got=$(probe "$1" content_type); case "$got" in $2) ;; *) fail "$1 served as $got, not $2" ;; esac; }

for _ in $(seq 1 30); do
    [ "$(probe / http_code)" = "200" ] && break
    sleep 2
done
expect_status / 200
expect_status /this-page-does-not-exist-12345 404
expect_type /robots.txt "text/plain*"

redirect=$(curl -k -s -o /dev/null -w "%{http_code} %{redirect_url}" "$DEPLOY_URL/en/password-manager")
case "$redirect" in
    "301 "*/en/bitwarden) ;;
    *) fail "/en/password-manager answered '$redirect', expected a permanent redirect to /en/bitwarden" ;;
esac

title() { sed -n 's:.*<title>\([^<]*\)</title>.*:\1:p' | head -1; }
DIST="$(dirname "$0")/../web/dist"
pages=0
while IFS= read -r file; do
    path=${file#"$DIST"}
    path=${path%index.html}
    [ "$path" = "/" ] || path=${path%/}
    body=$(curl -k -s "$DEPLOY_URL$path")
    case "$body" in
        *'<div id="app"></div>'*) fail "$path is served as an empty shell, not prerendered" ;;
    esac
    want=$(title < "$file")
    got=$(echo "$body" | title)
    [ -n "$want" ] || fail "$file has no title"
    [ "$got" = "$want" ] || fail "$path is served with title '$got', expected '$want' from its own page"
    pages=$((pages + 1))
done < <(find "$DIST" -name index.html)
[ "$pages" -gt 10 ] || fail "only $pages prerendered pages found in $DIST"
echo "$pages prerendered pages served"

source "$CONFIG_DIR/site.env"
echo "SITE_INDEXABLE=${SITE_INDEXABLE:?SITE_INDEXABLE is required}"
robots=$(curl -k -s "$DEPLOY_URL/robots.txt")

if [ "$SITE_INDEXABLE" = "true" ]; then
    expect_status /sitemap.xml 200
    expect_type /sitemap.xml "*xml*"
    echo "$robots" | grep -q '^Sitemap: https://syncloud.org/sitemap.xml' ||
        fail "robots.txt does not name the sitemap on a site that is indexed"
else
    expect_status /sitemap.xml 404
    ! echo "$robots" | grep -q '^Sitemap: ' ||
        fail "robots.txt advertises a sitemap on a site that is not indexed"
fi

for path in / /this-page-does-not-exist-12345; do
    tag=$(robots_tag "$path")
    if [ "$SITE_INDEXABLE" = "true" ]; then
        [ -z "$tag" ] || fail "$path sends '$tag' on a site that is meant to be indexed"
    else
        case "$tag" in
            *noindex*) ;;
            *) fail "$path sends '$tag', expected X-Robots-Tag: noindex" ;;
        esac
    fi
done

echo "verify OK"
