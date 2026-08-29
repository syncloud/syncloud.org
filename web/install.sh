#!/bin/bash
set -ex

DIR=$( cd "$( dirname "$0" )" && pwd )
cd "$DIR"

npm config set fetch-retries 5
npm config set fetch-retry-mintimeout 200000
npm config set fetch-retry-maxtimeout 1200000

for attempt in 1 2 3; do
    npm ci && exit 0
    echo "npm ci failed on attempt $attempt" >&2
    rm -rf node_modules
    sleep $((attempt * 15))
done

echo "npm ci failed after 3 attempts" >&2
exit 1
