#!/bin/bash
set -ex

apt-get update
apt-get install -y sshpass openssh-client curl ca-certificates

source "$(dirname "$0")/ssh.sh"

ssh-keygen -t ed25519 -f $KEYFILE -N "" -q
PUB=$(cat ${KEYFILE}.pub)

sshpass -p syncloud ssh -o StrictHostKeyChecking=no "$REMOTE" \
    "mkdir -p /root/.ssh && echo '$PUB' >> /root/.ssh/authorized_keys && chmod 600 /root/.ssh/authorized_keys"
