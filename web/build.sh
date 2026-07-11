#!/bin/bash
set -ex

DIR=$( cd "$( dirname "$0" )" && pwd )
cd "$DIR"

npm config set fetch-retry-mintimeout 200000
npm config set fetch-retry-maxtimeout 1200000
npm install
npm run test
npm run lint
npm run build
