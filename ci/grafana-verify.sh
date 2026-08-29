#!/bin/bash
set -ex

GRAFANA="${GRAFANA_HOST:?GRAFANA_HOST is required}"

curl -fsS "http://$GRAFANA/api/dashboards/uid/syncloud-org" \
    --netrc-file <(printf 'machine %s login admin password admin\n' "${GRAFANA%%:*}") \
    -o /tmp/deployed-dashboard.json

python3 - << 'CHECK'
import json, sys

body = json.load(open("/tmp/deployed-dashboard.json"))
dashboard = body["dashboard"]

if dashboard["title"] != "syncloud.org":
    sys.exit(f"unexpected title {dashboard['title']}")

panels = dashboard["panels"]
if not panels:
    sys.exit("dashboard has no panels")

for panel in panels:
    for target in panel.get("targets", []):
        if "${DS_PROMETHEUS}" in json.dumps(target):
            sys.exit(f"panel {panel['id']} kept the datasource placeholder")
    uid = panel.get("datasource", {}).get("uid", "")
    if uid != "victoria-metrics":
        sys.exit(f"panel {panel['id']} points at {uid!r}, not the datasource we created")

names = [v["name"] for v in dashboard["templating"]["list"]]
if "env" not in names:
    sys.exit(f"no env variable to switch uat and prod, got {names}")

print(f"dashboard ok: {len(panels)} panels, variables {names}")
CHECK
