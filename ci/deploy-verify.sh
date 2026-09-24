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

code=000
for i in $(seq 1 30); do
    code=$(curl -k -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/") || code=000
    [ "$code" = "200" ] && break
    sleep 2
done
if [ "$code" != "200" ]; then
    echo "site did not come up: last http_code=$code"
    curl -k -sv "$DEPLOY_URL/" 2>&1 | tail -20 || true
    exit 1
fi

body=$(curl -k -s "$DEPLOY_URL/")
echo "$body" | grep -q 'id="app"' || { echo "response is not the Vue SPA root"; echo "$body" | head -20; exit 1; }
echo "$body" | grep -q '/assets/index-' || { echo "built assets not referenced"; exit 1; }

for path in /en/password-manager /en/games /en/actual-budget; do
    echo "$body" | grep -q "href=\"$path\"" || { echo "the front page does not link $path"; exit 1; }
done

for path in /en/private-cloud /de/private-cloud /en/raspberry-pi /de/raspberry-pi /en/remote-access /de/remote-access; do
    if echo "$body" | grep -q "href=\"$path\""; then
        echo "the front page links $path, which is meant to be unindexed"
        exit 1
    fi
done

status() {
    curl -k -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL$1"
}

content_type() {
    curl -k -s -o /dev/null -w "%{content_type}" "$DEPLOY_URL$1"
}

expect_status() {
    got=$(status "$1")
    [ "$got" = "$2" ] || { echo "$1 returned $got, expected $2"; curl -k -s "$DEPLOY_URL$1" | head -5; exit 1; }
}

INDEXABLE_ROUTES="/ /setup /faq /privacy /en/password-manager /en/games /en/actual-budget"
NOINDEX_LANDING_ROUTES="/en/private-cloud /de/private-cloud /en/raspberry-pi /de/raspberry-pi /en/remote-access /de/remote-access"

expect_status /robots.txt 200
expect_status /setup 200
expect_status /de/remote-access 200
expect_status /en/password-manager 200
expect_status /en/games 200
expect_status /en/actual-budget 200
expect_status /this-page-does-not-exist-12345 404
expect_status /en/no-such-landing-page 404

case "$(content_type /robots.txt)" in
    text/plain*) ;;
    *) echo "robots.txt served as $(content_type /robots.txt), not text/plain"; exit 1 ;;
esac

robots=$(curl -k -s "$DEPLOY_URL/robots.txt")
echo "$robots" | grep -q '^User-agent: \*' || { echo "robots.txt has no user agent line"; exit 1; }
echo "$robots" | grep -q '^Allow: /$' || { echo "robots.txt does not allow crawling"; exit 1; }
if echo "$robots" | grep -q '^Disallow: /$'; then
    echo "robots.txt blocks crawling outright, which hides any noindex from a crawler"
    exit 1
fi

for path in $NOINDEX_LANDING_ROUTES; do
    curl -k -s "$DEPLOY_URL$path" | grep -q '<meta name="robots" content="noindex">' ||
        { echo "$path is not marked noindex"; exit 1; }
done

for path in $INDEXABLE_ROUTES; do
    if curl -k -s "$DEPLOY_URL$path" | grep -q 'name="robots"'; then
        echo "$path carries a robots tag and should not"
        exit 1
    fi
done

source "$CONFIG_DIR/site.env"
echo "SITE_INDEXABLE=${SITE_INDEXABLE:?SITE_INDEXABLE is required}"

robots_tag() {
    curl -k -s -D - -o /dev/null "$DEPLOY_URL$1" | tr -d '\r' | grep -i '^x-robots-tag:' || true
}

if [ "$SITE_INDEXABLE" = "true" ]; then
    expect_status /sitemap.xml 200
    case "$(content_type /sitemap.xml)" in
        *xml*) ;;
        *) echo "sitemap.xml served as $(content_type /sitemap.xml), not xml"; exit 1 ;;
    esac
    echo "$robots" | grep -q '^Sitemap: https://syncloud.org/sitemap.xml' || { echo "robots.txt does not name the sitemap"; exit 1; }

    sitemap=$(curl -k -s "$DEPLOY_URL/sitemap.xml")
    for path in $INDEXABLE_ROUTES; do
        echo "$sitemap" | grep -q "<loc>https://syncloud.org$path</loc>" || { echo "sitemap.xml is missing $path"; exit 1; }
    done
    for path in $NOINDEX_LANDING_ROUTES; do
        if echo "$sitemap" | grep -q "<loc>https://syncloud.org$path</loc>"; then
            echo "sitemap.xml lists $path, which is noindex"
            exit 1
        fi
    done

    for path in / /de/remote-access /en/actual-budget; do
        found=$(robots_tag "$path")
        [ -z "$found" ] || { echo "$path sends '$found' on a site that is meant to be indexed"; exit 1; }
    done
else
    expect_status /sitemap.xml 404
    if echo "$robots" | grep -q '^Sitemap: '; then
        echo "robots.txt advertises a sitemap on a site that is not indexed"
        exit 1
    fi

    for path in / /setup /de/remote-access /this-page-does-not-exist-12345; do
        found=$(robots_tag "$path")
        case "$found" in
            *noindex*) ;;
            *) echo "$path sends '$found', expected X-Robots-Tag: noindex"; exit 1 ;;
        esac
    done
fi

de=$(curl -k -s "$DEPLOY_URL/de/remote-access")
en=$(curl -k -s "$DEPLOY_URL/en/remote-access")
echo "$de" | grep -q '<html lang="de"' || { echo "the German landing page is not marked German"; exit 1; }
echo "$de" | grep -q 'rel="canonical" href="https://syncloud.org/de/remote-access"' || { echo "the German landing page has no canonical"; exit 1; }
echo "$de" | grep -q 'Portfreigabe' || { echo "the German landing page has no body copy in the served html"; exit 1; }
echo "$en" | grep -q 'Tailscale' || { echo "the English landing page has no body copy in the served html"; exit 1; }
if echo "$de" | grep -q 'rel="alternate"'; then
    echo "the German landing page still carries hreflang links"
    exit 1
fi

password=$(curl -k -s "$DEPLOY_URL/en/password-manager")
echo "$password" | grep -q '<html lang="en"' || { echo "the password manager landing page is not marked English"; exit 1; }
echo "$password" | grep -q 'rel="canonical" href="https://syncloud.org/en/password-manager"' || { echo "the password manager landing page has no canonical"; exit 1; }
echo "$password" | grep -q 'not a free tier' || { echo "the password manager landing page has no body copy in the served html"; exit 1; }

games=$(curl -k -s "$DEPLOY_URL/en/games")
echo "$games" | grep -q '<html lang="en"' || { echo "the games landing page is not marked English"; exit 1; }
echo "$games" | grep -q 'rel="canonical" href="https://syncloud.org/en/games"' || { echo "the games landing page has no canonical"; exit 1; }
echo "$games" | grep -q 'not in a data centre' || { echo "the games landing page has no body copy in the served html"; exit 1; }
echo "$games" | grep -q 'games-play.webp' || { echo "the games landing page does not carry its screenshots"; exit 1; }
echo "$games" | grep -q 'trademarks of Mojang Studios' || { echo "the games landing page lost its trademark notice"; exit 1; }

budget=$(curl -k -s "$DEPLOY_URL/en/actual-budget")
echo "$budget" | grep -q '<html lang="en"' || { echo "the actual budget landing page is not marked English"; exit 1; }
echo "$budget" | grep -q 'rel="canonical" href="https://syncloud.org/en/actual-budget"' || { echo "the actual budget landing page has no canonical"; exit 1; }
echo "$budget" | grep -q 'not a free tier' || { echo "the actual budget landing page has no body copy in the served html"; exit 1; }
echo "$budget" | grep -q 'actual-budget-running.webp' || { echo "the actual budget landing page does not carry its screenshots"; exit 1; }
echo "$budget" | grep -q 'not affiliated with, endorsed by or sponsored by' || { echo "the actual budget landing page lost its non affiliation notice"; exit 1; }

titles=""
for path in $INDEXABLE_ROUTES $NOINDEX_LANDING_ROUTES; do
    title=$(curl -k -s "$DEPLOY_URL$path" | sed -n 's#.*<title>\(.*\)</title>.*#\1#p' | head -1)
    [ -n "$title" ] || { echo "$path has no title"; exit 1; }
    echo "$path -> $title"
    titles="$titles$title
"
done
unique=$(printf '%s' "$titles" | sort -u | wc -l)
total=$(printf '%s' "$titles" | wc -l)
[ "$unique" = "$total" ] || { echo "only $unique distinct titles across $total routes"; exit 1; }

curl -k -s "$DEPLOY_URL/this-page-does-not-exist-12345" | grep -q 'name="robots" content="noindex"' || { echo "the 404 page is not marked noindex"; exit 1; }

echo "verify OK ($code)"
