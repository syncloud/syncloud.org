#!/bin/bash
set -ex

if [ "$#" -ne 1 ]; then
    echo "usage: $0 <version>" >&2
    exit 1
fi
VERSION=$1

source "$(dirname "$0")/ssh.sh"

$SSH $REMOTE "sudo -n bash /tmp/syncloud.org/deploy/deploy.sh $VERSION"
