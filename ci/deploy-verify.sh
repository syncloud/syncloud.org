#!/bin/bash
set -ex

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

echo "verify OK ($code)"
