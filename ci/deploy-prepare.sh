#!/bin/bash
set -ex

source "$(dirname "$0")/ssh.sh"

$SSH $REMOTE "sudo -n rm -rf /tmp/syncloud.org"
$SSH $REMOTE "mkdir -p /tmp/syncloud.org/config"
$SSH $REMOTE "mkdir -p /tmp/syncloud.org/backend"
$SCP "$CONFIG_DIR/api.env" "${REMOTE}:/tmp/syncloud.org/config/api.env"
$SCP config/env/common.env "${REMOTE}:/tmp/syncloud.org/config/common.env"
$SCP "$CONFIG_DIR/site.env" "${REMOTE}:/tmp/syncloud.org/config/site.env"
$SCP deploy "${REMOTE}:/tmp/syncloud.org/"
$SCP config/caddy "${REMOTE}:/tmp/syncloud.org/config/caddy"
$SCP web/dist "${REMOTE}:/tmp/syncloud.org/web"
$SCP backend/bin/api "${REMOTE}:/tmp/syncloud.org/backend/api"
