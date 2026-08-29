#!/bin/bash
set -ex

GRAFANA="${GRAFANA_HOST:?GRAFANA_HOST is required}"

for _ in $(seq 1 60); do
    curl -fsS "http://$GRAFANA/api/health" | grep -q '"database": *"ok"' && break
    sleep 2
done
curl -fsS "http://$GRAFANA/api/health" | grep -q '"database": *"ok"'

curl -fsS -X POST "http://$GRAFANA/api/datasources" \
    -H 'Content-Type: application/json' \
    --netrc-file <(printf 'machine %s login admin password admin\n' "${GRAFANA%%:*}") \
    -d @ci/grafana/datasource.json
echo
