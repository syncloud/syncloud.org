#!/bin/bash
set -ex

source "$(dirname "$0")/ssh.sh"

STAGE=/tmp/syncloud.org-setup

$SSH $REMOTE "rm -rf $STAGE"
$SSH $REMOTE "mkdir -p $STAGE"
$SCP ci/test/setup.sh "${REMOTE}:$STAGE/setup.sh"
$SCP ci/sim "${REMOTE}:$STAGE/sim"
$SCP ci/caddy "${REMOTE}:$STAGE/caddy"

$SSH $REMOTE "bash $STAGE/setup.sh '${DEPLOY_URL:?DEPLOY_URL is required}' '$DEPLOY_HOST'"
