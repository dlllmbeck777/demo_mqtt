#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/docker-compose/.env"
TARGET_IP="65.109.174.58"
APP_FILE="$ROOT_DIR/docker-compose/app/docker-compose.yml"
DB_FILE="$ROOT_DIR/docker-compose/db/docker-compose.yml"
DATA_FILE="$ROOT_DIR/docker-compose/data/docker-compose.yml"

if [[ ! -f "$ENV_FILE" ]]; then
  cp "$ROOT_DIR/docker-compose/.env.example" "$ENV_FILE"
fi

set_env() {
  local key="$1"
  local value="$2"

  if grep -q "^${key}=" "$ENV_FILE"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
  else
    printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
  fi
}

set_env "ALLOWED_HOSTS" "${TARGET_IP} localhost 127.0.0.1"
set_env "APP_API_BASE_URL" "http://${TARGET_IP}:8000"
set_env "BACKEND_BASE_URL" "http://${TARGET_IP}:8000"
set_env "BASE_URL" "http://${TARGET_IP}"
set_env "REACT_APP_API_BASE_URL" "http://${TARGET_IP}:8000"
set_env "REACT_APP_WS_BASE_URL" "ws://${TARGET_IP}:8000"
set_env "REACT_APP_COUCHDB_URL" "http://${TARGET_IP}:5984/"
set_env "REACT_APP_INFLUX_URL" "http://${TARGET_IP}:8086"
set_env "NIFI_API_URL" "http://${TARGET_IP}:8082/nifi-api/"
set_env "MQTT_BROKER_ADDRESS" "${TARGET_IP}"
set_env "DIAGNOSTIC_LAYER_NAME" "horasan"
set_env "DIAGNOSTIC_DJANGO_HEALTH_URL" "http://django:8000/api/v1/health/"
set_env "DIAGNOSTIC_PROBE_INTERVAL_SECONDS" "60"

docker network inspect app_net >/dev/null 2>&1 || docker network create app_net >/dev/null

docker compose --env-file "$ENV_FILE" -f "$DB_FILE" up -d
docker compose --env-file "$ENV_FILE" -f "$DATA_FILE" up -d
docker compose --env-file "$ENV_FILE" -f "$APP_FILE" build django frontend
docker compose --env-file "$ENV_FILE" -f "$APP_FILE" run --rm django bash -lc "cd backend && python manage.py migrate"
docker compose --env-file "$ENV_FILE" -f "$APP_FILE" up -d
docker compose --env-file "$ENV_FILE" -f "$APP_FILE" up -d --build diagnostic-probes diagnostic-notifications-consumer diagnostic-warnings-consumer diagnostic-logs-consumer housekeeping

cat <<EOF
Deployment commands completed for ${TARGET_IP}.

Optional next step if the databases are not restored yet:
  ./scripts/restore-demo-horasan.sh ./transfer/demo_dump.sql ./transfer/horasan_dump.sql

Checks:
  curl -I http://localhost:8000/api/v1/health/
  curl -I http://localhost
EOF
