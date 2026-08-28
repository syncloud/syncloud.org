#!/bin/bash
set -e

PROJECT=${1:?usage: $0 <desktop|mobile>}
ROOT=$( cd "$( dirname "$0" )/.." && pwd )
SOCKET=/tmp/syncloud.org.api.socket

# nothing is cleaned up on exit because drone throws the step container away

"$ROOT/ci/sim/github-faker" --address 127.0.0.1:8081 &

"$ROOT/backend/bin/api" \
  --socket "$SOCKET" \
  --metrics 127.0.0.1:9101 \
  --release-base http://127.0.0.1:8081/releases &

for _ in $(seq 1 30); do
  [ -S "$SOCKET" ] && break
  sleep 1
done
[ -S "$SOCKET" ] || { echo "api socket never appeared" >&2; exit 1; }

# caddy serves the site and proxies /api to the api socket in production,
# site-faker does the same here so the browser talks to a single origin
"$ROOT/ci/sim/site-faker" --address 127.0.0.1:8080 --www "$ROOT/web/dist" --socket "$SOCKET" &

for _ in $(seq 1 30); do
  curl -sf http://127.0.0.1:8080/ >/dev/null && break
  sleep 1
done
curl -sf http://127.0.0.1:8080/ >/dev/null
curl -sf http://127.0.0.1:9101/metrics >/dev/null

cd "$ROOT/web"
npx playwright test --project="$PROJECT"
