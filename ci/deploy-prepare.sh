#!/bin/bash
set -ex

if [ "$#" -ne 1 ]; then
    echo "usage: $0 <env: uat|prod>" >&2
    exit 1
fi
ENV=$1

if ! command -v ssh >/dev/null; then
    apt-get update
    apt-get install -y openssh-client ca-certificates
fi

KEYFILE=/tmp/_deploy_key
set +x
printf '%s\n' "$DEPLOY_KEY" > "$KEYFILE"
set -x
chmod 600 "$KEYFILE"

SSH="ssh -i $KEYFILE -o StrictHostKeyChecking=no"
SCP="scp -i $KEYFILE -o StrictHostKeyChecking=no -r"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"

$SSH $REMOTE "sudo -n rm -rf /tmp/syncloud.org && mkdir -p /tmp/syncloud.org/config"
$SCP deploy "${REMOTE}:/tmp/syncloud.org/"
$SCP "config/${ENV}" "${REMOTE}:/tmp/syncloud.org/config/${ENV}"
$SCP web/dist "${REMOTE}:/tmp/syncloud.org/web"
