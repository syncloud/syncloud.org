#!/bin/bash
set -ex

if [ "$#" -ne 3 ]; then
    echo "usage: $0 <site url> <deploy host> <grafana admin password>" >&2
    exit 1
fi
SITE_DOMAIN=$1
DEPLOY_HOST=$2
GRAFANA_PASSWORD=$3

STAGE=$(cd "$(dirname "$0")" && pwd)

apt-get update
apt-get install -y --no-install-recommends curl docker.io

useradd --create-home --shell /bin/bash ubuntu

systemctl start docker
for _ in $(seq 1 30); do
    docker info >/dev/null 2>&1 && break
    sleep 1
done
if ! docker info >/dev/null 2>&1; then
    echo "docker did not come up" >&2
    systemctl status docker --no-pager || true
    journalctl -u docker --no-pager | tail -40 || true
    exit 1
fi

install -m 0755 "$STAGE/sim/github-faker" /usr/local/bin/github-faker
( /usr/local/bin/github-faker --address :8081 </dev/null >/var/log/github-faker.log 2>&1 & )
for _ in $(seq 1 30); do
    curl -sf http://127.0.0.1:8081/x.xz >/dev/null 2>&1 && break
    sleep 1
done
if ! curl -sf http://127.0.0.1:8081/x.xz >/dev/null 2>&1; then
    echo "github faker did not come up" >&2
    cat /var/log/github-faker.log || true
    exit 1
fi

docker network create syncloud

docker run -d --name vm --network syncloud \
    victoriametrics/victoria-metrics:v1.110.0

install -d /etc/grafana
cat > /etc/grafana/grafana.ini <<GRAFANA
[security]
admin_user = admin
admin_password = $GRAFANA_PASSWORD
GRAFANA

docker run -d --name grafana --network syncloud \
    -p 127.0.0.1:3000:3000 \
    -e GF_SECURITY_ADMIN_PASSWORD="$GRAFANA_PASSWORD" \
    grafana/grafana:11.3.0

for _ in $(seq 1 60); do
    curl -fsS http://127.0.0.1:3000/api/health 2>/dev/null | grep -q '"database": *"ok"' && break
    sleep 2
done
if ! curl -fsS http://127.0.0.1:3000/api/health 2>/dev/null | grep -q '"database": *"ok"'; then
    echo "grafana did not come up" >&2
    docker logs grafana 2>&1 | tail -40
    exit 1
fi

curl -fsS -u "admin:$GRAFANA_PASSWORD" -X POST http://127.0.0.1:3000/api/datasources \
    -H 'Content-Type: application/json' -d @"$STAGE/datasource.json"

install -d /etc/systemd/system/syncloud.org-api.service.d
cat > /etc/systemd/system/syncloud.org-api.service.d/test.conf <<UNIT
[Service]
ExecStart=
ExecStart=/var/www/syncloud.org/bin/api --socket /var/www/syncloud.org/api.socket --metrics :9101 --release-base http://$DEPLOY_HOST:8081/releases --release-api http://127.0.0.1:8081/releases --release-cache 5s
UNIT

install -d /etc/caddy/conf.d
install -m 0644 "$STAGE/caddy/Caddyfile" /etc/caddy/Caddyfile

cat > /etc/caddy/conf.d/placeholder.caddy <<'PLACEHOLDER'
:9999 {
	respond "placeholder"
}
PLACEHOLDER

docker run -d --name caddy --network=host \
    -e SITE_DOMAIN="$SITE_DOMAIN" \
    -v /etc/caddy:/etc/caddy \
    -v /var/www:/var/www \
    caddy:2.8-alpine caddy run --config /etc/caddy/Caddyfile --adapter caddyfile

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
