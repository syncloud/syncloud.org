#!/bin/bash
set -ex

DIR=$( cd "$( dirname "$0" )" && pwd )
cd "$DIR"

./install.sh
npm run test
npm run lint
npm run build
