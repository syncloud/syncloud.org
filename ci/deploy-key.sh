#!/bin/bash
set -ex

apt-get update
apt-get install -y openssh-client ca-certificates curl

source "$(dirname "$0")/ssh.sh"

set +x
printf '%s\n' "${DEPLOY_KEY:?DEPLOY_KEY is required}" > "$KEYFILE"
set -x
chmod 600 "$KEYFILE"
