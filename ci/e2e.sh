#!/bin/bash
set -e

PROJECT=${1:?usage: $0 <desktop|mobile>}
ROOT=$( cd "$( dirname "$0" )/.." && pwd )

"$ROOT/ci/sim/github-faker" --address 127.0.0.1:8081 &
FAKER=$!
"$ROOT/backend/bin/api" \
  --socket tcp://127.0.0.1:8080 \
  --metrics 127.0.0.1:9101 \
  --www "$ROOT/web/dist" \
  --release-base http://127.0.0.1:8081/releases &
API=$!
trap 'kill $FAKER $API 2>/dev/null || true' EXIT

for i in $(seq 1 30); do
  curl -sf http://127.0.0.1:8080/ >/dev/null && break
  sleep 1
done
curl -sf http://127.0.0.1:9101/metrics >/dev/null

cd "$ROOT/web"
npx playwright test --project="$PROJECT"
