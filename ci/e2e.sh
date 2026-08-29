#!/bin/bash
set -e

PROJECT=${1:?usage: $0 <desktop|mobile>}
ROOT=$( cd "$( dirname "$0" )/.." && pwd )
BASE=${PLAYWRIGHT_BASE_URL:?PLAYWRIGHT_BASE_URL is required}

for _ in $(seq 1 60); do
  curl -sf "$BASE/" >/dev/null && break
  sleep 2
done
curl -sf "$BASE/" >/dev/null

cd "$ROOT/web"
npx playwright test --project="$PROJECT"
