# Server 65.109.174.58

This runbook applies the split historical stack to server `65.109.174.58`.

It assumes:

- repo path: `~/mqtt_broker/demo_mqtt`
- shared env file: `docker-compose/.env`
- restore assets already exist in `transfer/`

## One-time env setup

```bash
cd ~/mqtt_broker/demo_mqtt
test -f docker-compose/.env || cp docker-compose/.env.example docker-compose/.env

sed -i 's|^ALLOWED_HOSTS=.*|ALLOWED_HOSTS=65.109.174.58 localhost 127.0.0.1|' docker-compose/.env
sed -i 's|^APP_API_BASE_URL=.*|APP_API_BASE_URL=http://65.109.174.58:8000|' docker-compose/.env
sed -i 's|^BACKEND_BASE_URL=.*|BACKEND_BASE_URL=http://65.109.174.58:8000|' docker-compose/.env
sed -i 's|^BASE_URL=.*|BASE_URL=http://65.109.174.58|' docker-compose/.env
sed -i 's|^REACT_APP_API_BASE_URL=.*|REACT_APP_API_BASE_URL=http://65.109.174.58:8000|' docker-compose/.env
sed -i 's|^REACT_APP_WS_BASE_URL=.*|REACT_APP_WS_BASE_URL=ws://65.109.174.58:8000|' docker-compose/.env
sed -i 's|^REACT_APP_COUCHDB_URL=.*|REACT_APP_COUCHDB_URL=http://65.109.174.58:5984/|' docker-compose/.env
sed -i 's|^REACT_APP_INFLUX_URL=.*|REACT_APP_INFLUX_URL=http://65.109.174.58:8086|' docker-compose/.env
sed -i 's|^NIFI_API_URL=.*|NIFI_API_URL=http://65.109.174.58:8082/nifi-api/|' docker-compose/.env
sed -i 's|^MQTT_BROKER_ADDRESS=.*|MQTT_BROKER_ADDRESS=65.109.174.58|' docker-compose/.env
sed -i 's|^DIAGNOSTIC_LAYER_NAME=.*|DIAGNOSTIC_LAYER_NAME=horasan|' docker-compose/.env
sed -i 's|^DIAGNOSTIC_DJANGO_HEALTH_URL=.*|DIAGNOSTIC_DJANGO_HEALTH_URL=http://django:8000/api/v1/health/|' docker-compose/.env
sed -i 's|^DIAGNOSTIC_PROBE_INTERVAL_SECONDS=.*|DIAGNOSTIC_PROBE_INTERVAL_SECONDS=60|' docker-compose/.env
```

## Start DB and data stacks

```bash
cd ~/mqtt_broker/demo_mqtt
docker network inspect app_net >/dev/null 2>&1 || docker network create app_net
docker compose --env-file docker-compose/.env -f docker-compose/db/docker-compose.yml up -d
docker compose --env-file docker-compose/.env -f docker-compose/data/docker-compose.yml up -d
```

## Restore PostgreSQL

```bash
cd ~/mqtt_broker/demo_mqtt
chmod +x scripts/restore-demo-horasan.sh
./scripts/restore-demo-horasan.sh ./transfer/demo_dump.sql ./transfer/horasan_dump.sql
```

## Optional CouchDB import

```bash
cd ~/mqtt_broker/demo_mqtt
until curl -sf http://admin:change-me@127.0.0.1:5984/_up >/dev/null; do sleep 2; done

python3 - <<'PY'
import base64
import json
import urllib.error
import urllib.request

auth = base64.b64encode(b"admin:change-me").decode()
headers = {"Authorization": f"Basic {auth}", "Content-Type": "application/json"}

for db_name, path in [("demo", "transfer/demo_db.json"), ("treeviewstate", "transfer/treeviewstate_db.json")]:
    req = urllib.request.Request(
        f"http://127.0.0.1:5984/{db_name}",
        method="PUT",
        headers={"Authorization": f"Basic {auth}"},
    )
    try:
        urllib.request.urlopen(req)
    except urllib.error.HTTPError as exc:
        if exc.code != 412:
            raise

    with open(path, "r", encoding="utf-8") as handle:
        source = json.load(handle)

    docs = [row["doc"] for row in source.get("rows", []) if row.get("doc")]
    payload = json.dumps({"docs": docs}).encode("utf-8")

    req = urllib.request.Request(
        f"http://127.0.0.1:5984/{db_name}/_bulk_docs",
        data=payload,
        headers=headers,
    )
    urllib.request.urlopen(req).read()
    print(db_name, len(docs))
PY
```

## Start app and diagnostics services

```bash
cd ~/mqtt_broker/demo_mqtt
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml build django frontend
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml run --rm django bash -lc "cd /django/backend && python manage.py migrate"
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml up -d
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml up -d --build diagnostic-probes diagnostic-notifications-consumer diagnostic-warnings-consumer diagnostic-logs-consumer housekeeping
```

## Smoke checks

```bash
curl -I http://localhost:8000/api/v1/health/
curl -I http://localhost
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml ps
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml logs --tail=100 diagnostic-probes
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml logs --tail=100 diagnostic-notifications-consumer
```

Expected endpoints:

- UI: `http://65.109.174.58/`
- React dev server: `http://65.109.174.58:3000/`
- Django API: `http://65.109.174.58:8000/api/v1/health/`
- Kafka UI: `http://65.109.174.58:9000/`
