#!/bin/bash
set -ex

source "$(dirname "$0")/ssh.sh"

STAGE=/tmp/syncloud.org-setup

$SSH $REMOTE "mkdir $STAGE"
$SCP ci/test/setup.sh "${REMOTE}:$STAGE/setup.sh"
$SCP ci/sim "${REMOTE}:$STAGE/sim"
$SCP ci/caddy "${REMOTE}:$STAGE/caddy"
$SCP ci/grafana/datasource.json "${REMOTE}:$STAGE/datasource.json"

$SSH $REMOTE "bash $STAGE/setup.sh '${DEPLOY_URL:?DEPLOY_URL is required}' '$DEPLOY_HOST' '${GRAFANA_PASSWORD:?GRAFANA_PASSWORD is required}'"
