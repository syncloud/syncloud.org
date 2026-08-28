#!/bin/bash
set -ex

if [ "$#" -ne 2 ]; then
    echo "usage: $0 <env: test|uat|prod> <version>" >&2
    exit 1
fi
ENV=$1
VERSION=$2

KEYFILE=/tmp/_deploy_key
SSH="ssh -i $KEYFILE -o StrictHostKeyChecking=no"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"

$SSH $REMOTE "sudo -n bash /tmp/syncloud.org/deploy/deploy.sh $VERSION $ENV"
