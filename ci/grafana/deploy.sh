#!/bin/bash
set -ex

if [ "$#" -ne 2 ]; then
    echo "usage: $0 <grafana host:port> <dashboard json>" >&2
    exit 1
fi
GRAFANA=$1
DASHBOARD=$2

INI=/etc/grafana/grafana.ini
NETRC=$(mktemp)
trap 'rm -f "$NETRC"' EXIT
chmod 600 "$NETRC"

set +x
{
    printf 'machine %s login %s password %s\n' \
        "${GRAFANA%%:*}" \
        "$(awk -F= '/^[[:space:]]*admin_user[[:space:]]*=/{gsub(/^[[:space:]]+|[[:space:]]+$/,"",$2); print $2}' "$INI" | head -1)" \
        "$(awk -F= '/^[[:space:]]*admin_password[[:space:]]*=/{gsub(/^[[:space:]]+|[[:space:]]+$/,"",$2); print $2}' "$INI" | head -1)"
} > "$NETRC"
set -x

CURL="curl -fsS --netrc-file $NETRC"

for _ in $(seq 1 30); do
    $CURL "http://$GRAFANA/api/health" | grep -q '"database": *"ok"' && break
    sleep 2
done
$CURL "http://$GRAFANA/api/health" | grep -q '"database": *"ok"'

DS_UID=$($CURL "http://$GRAFANA/api/datasources" |
    python3 -c "import json,sys; print(next(d['uid'] for d in json.load(sys.stdin) if d['type']=='prometheus'))")

python3 - "$DASHBOARD" "$DS_UID" > /tmp/syncloud.org-dashboard-payload.json <<'PAYLOAD'
import json, sys
raw = open(sys.argv[1]).read().replace('${DS_PROMETHEUS}', sys.argv[2])
dashboard = json.loads(raw)
dashboard.pop('__inputs', None)
dashboard.pop('id', None)
print(json.dumps({'dashboard': dashboard, 'overwrite': True,
                  'folderId': 0, 'message': 'CI auto-deploy'}))
PAYLOAD

$CURL -X POST -H 'Content-Type: application/json' \
    --data @/tmp/syncloud.org-dashboard-payload.json \
    "http://$GRAFANA/api/dashboards/db"
echo
