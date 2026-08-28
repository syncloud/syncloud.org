#!/bin/bash
set -ex

if [ "$#" -ne 1 ]; then
    echo "usage: $0 <env: test|uat|prod>" >&2
    exit 1
fi
ENV=$1

if ! command -v ssh >/dev/null; then
    apt-get update
    apt-get install -y openssh-client ca-certificates
fi

KEYFILE=/tmp/_deploy_key
if [ ! -f "$KEYFILE" ]; then
    set +x
    printf '%s\n' "$DEPLOY_KEY" > "$KEYFILE"
    set -x
    chmod 600 "$KEYFILE"
fi

SSH="ssh -i $KEYFILE -o StrictHostKeyChecking=no"
SCP="scp -i $KEYFILE -o StrictHostKeyChecking=no -r"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"

$SSH $REMOTE "sudo -n rm -rf /tmp/syncloud.org && mkdir -p /tmp/syncloud.org/config /tmp/syncloud.org/backend"
$SCP deploy "${REMOTE}:/tmp/syncloud.org/"
$SCP config/caddy "${REMOTE}:/tmp/syncloud.org/config/caddy"
$SCP web/dist "${REMOTE}:/tmp/syncloud.org/web"
$SCP backend/bin/api "${REMOTE}:/tmp/syncloud.org/backend/api"
