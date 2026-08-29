#!/bin/bash
set -ex

source "$(dirname "$0")/ssh.sh"

STAGE=/tmp/syncloud.org-grafana

$SSH $REMOTE "rm -rf $STAGE"
$SSH $REMOTE "mkdir $STAGE"
$SCP backend/bin/grafana-deploy "${REMOTE}:$STAGE/grafana-deploy"
$SCP ci/grafana/downloads.json "${REMOTE}:$STAGE/downloads.json"

$SSH $REMOTE "sudo -n $STAGE/grafana-deploy --host ${GRAFANA_HOST:?GRAFANA_HOST is required} --dashboard $STAGE/downloads.json"
