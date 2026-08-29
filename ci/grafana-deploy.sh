#!/bin/bash
set -ex

source "$(dirname "$0")/ssh.sh"

STAGE=/tmp/syncloud.org-grafana

$SSH $REMOTE "rm -rf $STAGE"
$SSH $REMOTE "mkdir $STAGE"
$SCP ci/grafana/deploy.sh "${REMOTE}:$STAGE/deploy.sh"
$SCP ci/grafana/downloads.json "${REMOTE}:$STAGE/downloads.json"

$SSH $REMOTE "sudo -n bash $STAGE/deploy.sh '${GRAFANA_HOST:?GRAFANA_HOST is required}' $STAGE/downloads.json"
