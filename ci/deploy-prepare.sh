#!/bin/bash
set -ex

source "$(dirname "$0")/ssh.sh"

$SSH $REMOTE "sudo -n rm -rf /tmp/syncloud.org && mkdir -p /tmp/syncloud.org/config /tmp/syncloud.org/backend"
$SCP deploy "${REMOTE}:/tmp/syncloud.org/"
$SCP config/caddy "${REMOTE}:/tmp/syncloud.org/config/caddy"
$SCP web/dist "${REMOTE}:/tmp/syncloud.org/web"
$SCP backend/bin/api "${REMOTE}:/tmp/syncloud.org/backend/api"
