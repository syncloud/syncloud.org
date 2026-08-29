#!/bin/bash
set -ex

KEYFILE=/tmp/_deploy_key
SSH="ssh -i $KEYFILE -o StrictHostKeyChecking=no"
SCP="scp -i $KEYFILE -o StrictHostKeyChecking=no -r"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"

$SSH $REMOTE "rm -rf /tmp/syncloud.org-setup && mkdir -p /tmp/syncloud.org-setup/sim /tmp/syncloud.org-setup/caddy"
$SCP ci/sim/. "${REMOTE}:/tmp/syncloud.org-setup/sim/"
$SCP ci/caddy/Caddyfile "${REMOTE}:/tmp/syncloud.org-setup/caddy/Caddyfile"

$SSH $REMOTE SITE_DOMAIN="${SITE_DOMAIN:?SITE_DOMAIN is required}" bash -s <<'REMOTE_SCRIPT'
set -ex
STAGE=/tmp/syncloud.org-setup

apt-get update
apt-get install -y --no-install-recommends curl docker.io

# the site files and the api service belong to ubuntu on a real host
id -u ubuntu >/dev/null 2>&1 || useradd --create-home --shell /bin/bash ubuntu

if ! docker info >/dev/null 2>&1; then
    systemctl start docker 2>/dev/null || true
fi
if ! docker info >/dev/null 2>&1; then
    ( dockerd --storage-driver=vfs </dev/null >/var/log/dockerd.log 2>&1 & )
fi
for _ in $(seq 1 30); do docker info >/dev/null 2>&1 && break; sleep 1; done
docker info >/dev/null

# the release host stands in for github so the tests never download an image
pkill -f /usr/local/bin/github-faker 2>/dev/null || true
install -m 0755 "$STAGE/sim/github-faker" /usr/local/bin/github-faker
( /usr/local/bin/github-faker --address 127.0.0.1:8081 </dev/null >/var/log/github-faker.log 2>&1 & )
for _ in $(seq 1 30); do curl -sf http://127.0.0.1:8081/x.xz >/dev/null 2>&1 && break; sleep 1; done

# the api unit ships pointing at github, so send it at the faker here instead
install -d /etc/systemd/system/syncloud.org-api.service.d
cat > /etc/systemd/system/syncloud.org-api.service.d/test.conf <<UNIT
[Service]
ExecStart=
ExecStart=/var/www/syncloud.org/bin/api --socket /var/www/syncloud.org/api.socket --metrics :9101 --release-base http://127.0.0.1:8081/releases --release-api http://127.0.0.1:8081/releases/latest --release-cache 5s
UNIT

install -d /etc/caddy/conf.d
install -m 0644 "$STAGE/caddy/Caddyfile" /etc/caddy/Caddyfile

# caddy imports conf.d and the deploy has not run yet, so give the glob a match
cat > /etc/caddy/conf.d/placeholder.caddy <<'PLACEHOLDER'
:9999 {
	respond "placeholder"
}
PLACEHOLDER

docker rm -f caddy 2>/dev/null || true
docker run -d --name caddy --network=host \
    -e SITE_DOMAIN="$SITE_DOMAIN" \
    -v /etc/caddy:/etc/caddy \
    -v /var/www:/var/www \
    caddy:2.8-alpine caddy run --config /etc/caddy/Caddyfile --adapter caddyfile

# docker run -d succeeds even when the container dies on a bad config, so make
# sure caddy is actually serving before anything is deployed into it
for _ in $(seq 1 30); do
    curl -sf http://127.0.0.1:9999/ >/dev/null 2>&1 && break
    sleep 1
done
if ! curl -sf http://127.0.0.1:9999/ >/dev/null 2>&1; then
    echo "caddy did not come up" >&2
    docker ps -a --filter name=caddy
    docker logs caddy 2>&1 | tail -40
    exit 1
fi
echo "caddy is serving"
ss -ltnp 2>/dev/null | head -20 || true
REMOTE_SCRIPT
