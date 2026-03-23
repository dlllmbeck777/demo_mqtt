#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 SERVER_IP [DEMO_DUMP] [HORASAN_DUMP]"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVER_IP="$1"
DEMO_DUMP="${2:-$ROOT_DIR/transfer/demo_dump.sql}"
HORASAN_DUMP="${3:-$ROOT_DIR/transfer/horasan_dump.sql}"
BUNDLE_DIR="${BUNDLE_DIR:-${OFFLINE_BUNDLE_DIR:-}}"
DEMO_COUCH_JSON="${DEMO_COUCH_JSON:-$ROOT_DIR/transfer/demo_db.json}"
TREEVIEW_COUCH_JSON="${TREEVIEW_COUCH_JSON:-$ROOT_DIR/transfer/treeviewstate_db.json}"
TARGET_LAYER="${TARGET_LAYER:-${DIAGNOSTIC_LAYER_NAME:-${COMPANY_NAME:-Inkai}}}"
STACK_MODE="${STACK_MODE:-${BUNDLE_MODE:-pipeline}}"

ENV_FILE="$ROOT_DIR/docker-compose/.env"
APP_FILE="$ROOT_DIR/docker-compose/app/docker-compose.yml"
DB_FILE="$ROOT_DIR/docker-compose/db/docker-compose.yml"
DATA_FILE="$ROOT_DIR/docker-compose/data/docker-compose.yml"
RESTORE_SCRIPT="$ROOT_DIR/scripts/restore-demo-horasan.sh"

case "$STACK_MODE" in
  light|pipeline|full)
    ;;
  *)
    echo "Unsupported STACK_MODE: $STACK_MODE"
    echo "Use one of: light, pipeline, full"
    exit 1
    ;;
esac

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

get_env_value() {
  local key="$1"
  local default_value="${2:-}"
  local line

  line="$(grep -E "^${key}=" "$ENV_FILE" | tail -n 1 || true)"
  if [[ -z "$line" ]]; then
    printf '%s' "$default_value"
    return 0
  fi

  printf '%s' "${line#*=}"
}

assert_file_exists() {
  local path="$1"
  local label="$2"

  if [[ ! -f "$path" ]]; then
    echo "${label} not found: $path"
    exit 1
  fi
}

assert_not_lfs_pointer() {
  local path="$1"

  if head -n 1 "$path" | grep -q "https://git-lfs.github.com/spec/v1"; then
    echo "File is still a Git LFS pointer: $path"
    exit 1
  fi
}

wait_for_couch() {
  python3 - "$COUCHDB_BOOTSTRAP_USER" "$COUCHDB_BOOTSTRAP_PASSWORD" <<'PY'
import base64
import sys
import time
import urllib.error
import urllib.request

user = sys.argv[1]
password = sys.argv[2]
deadline = time.time() + 180
auth = base64.b64encode(f"{user}:{password}".encode()).decode()
request = urllib.request.Request(
    "http://127.0.0.1:5984/_up",
    headers={"Authorization": f"Basic {auth}"},
)
last_error = "unknown error"

while time.time() < deadline:
    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            if response.status == 200:
                sys.exit(0)
    except urllib.error.HTTPError as exc:
        if exc.code == 401:
            raise SystemExit(
                "CouchDB is reachable but credentials were rejected. "
                "Check COUCHDB_USER/COUCHDB_PASSWORD in docker-compose/.env "
                "or reset the couch-data volume if it belongs to an older deployment."
            )
        last_error = f"HTTP {exc.code}"
        time.sleep(2)
    except Exception as exc:
        last_error = str(exc)
        time.sleep(2)

raise SystemExit(f"CouchDB did not become ready in time: {last_error}")
PY
}

should_reset_couch_volume() {
  local value
  value="$(printf '%s' "${RESET_COUCHDB_ON_BOOTSTRAP:-$(get_env_value RESET_COUCHDB_ON_BOOTSTRAP 1)}" | tr '[:upper:]' '[:lower:]')"

  case "$value" in
    1|true|yes)
      return 0
      ;;
    0|false|no)
      return 1
      ;;
    *)
      echo "Unsupported RESET_COUCHDB_ON_BOOTSTRAP value: $value"
      echo "Use one of: 1, true, yes, 0, false, no"
      exit 1
      ;;
  esac
}

recreate_couch_volume() {
  local container_id=""
  local volume_name=""

  container_id="$(docker compose --env-file "$ENV_FILE" -f "$DB_FILE" ps -q couchserver 2>/dev/null || true)"

  if [[ -n "$container_id" ]]; then
    volume_name="$(docker inspect --format '{{range .Mounts}}{{if and (eq .Type "volume") (eq .Destination "/opt/couchdb/data")}}{{.Name}}{{end}}{{end}}' "$container_id" 2>/dev/null || true)"
  fi

  docker compose --env-file "$ENV_FILE" -f "$DB_FILE" stop couchserver >/dev/null 2>&1 || true

  if [[ -n "$container_id" ]]; then
    docker rm -f "$container_id" >/dev/null 2>&1 || true
  fi

  if [[ -n "$volume_name" ]]; then
    echo "Resetting CouchDB volume: $volume_name"
    docker volume rm -f "$volume_name" >/dev/null 2>&1 || true
  fi

  docker compose --env-file "$ENV_FILE" -f "$DB_FILE" up -d couchserver >/dev/null
}

load_offline_images() {
  if [[ -z "$BUNDLE_DIR" || ! -d "$BUNDLE_DIR" ]]; then
    return 1
  fi

  if [[ -x "$BUNDLE_DIR/load-all-images.sh" ]]; then
    bash "$BUNDLE_DIR/load-all-images.sh"
    return 0
  fi

  shopt -s nullglob
  local tar_files=("$BUNDLE_DIR"/*.tar)
  if (( ${#tar_files[@]} == 0 )); then
    return 1
  fi

  for image_tar in "${tar_files[@]}"; do
    echo "Loading $(basename "$image_tar")"
    docker load -i "$image_tar"
  done

  if [[ -x "$BUNDLE_DIR/retag-aliases.sh" ]]; then
    bash "$BUNDLE_DIR/retag-aliases.sh"
  fi

  return 0
}

db_services() {
  case "$STACK_MODE" in
    light|pipeline)
      printf '%s\n' couchserver postgres redis redis-ts mongo-dev
      ;;
    full)
      printf '%s\n' couchserver postgres pgadmin redis redis-ts mongo-dev mongo-express
      ;;
  esac
}

data_services() {
  case "$STACK_MODE" in
    light)
      printf '%s\n' influxdb1
      ;;
    pipeline)
      printf '%s\n' influxdb1 zookeeper apache-kafka-broker1 mosquitto nifi
      ;;
    full)
      printf '%s\n' influxdb1 zookeeper apache-kafka-broker1 control-center rabbitmq mosquitto nifi connect kafdrop
      ;;
  esac
}

data_build_services() {
  case "$STACK_MODE" in
    light)
      return 0
      ;;
    pipeline)
      printf '%s\n' nifi
      ;;
    full)
      printf '%s\n' nifi connect
      ;;
  esac
}

app_core_services() {
  printf '%s\n' django frontend client housekeeping
}

app_diagnostic_services() {
  case "$STACK_MODE" in
    light)
      return 0
      ;;
    pipeline|full)
      printf '%s\n' diagnostic-probes diagnostic-notifications-consumer diagnostic-warnings-consumer diagnostic-logs-consumer
      ;;
  esac
}

run_optional_layer_normalizers() {
  local normalized_layer
  normalized_layer="$(printf '%s' "$TARGET_LAYER" | tr '[:upper:]' '[:lower:]')"

  if [[ "$normalized_layer" != "inkai" ]]; then
    return 0
  fi

  docker compose --env-file "$ENV_FILE" -f "$APP_FILE" run --rm --no-deps django \
    bash -lc "cd backend && python manage.py normalize_inkai_structure --layer \"$TARGET_LAYER\""
}

if [[ ! -f "$DEMO_DUMP" && -n "$BUNDLE_DIR" && -f "$BUNDLE_DIR/transfer/demo_dump.sql" ]]; then
  DEMO_DUMP="$BUNDLE_DIR/transfer/demo_dump.sql"
fi

if [[ ! -f "$HORASAN_DUMP" && -n "$BUNDLE_DIR" && -f "$BUNDLE_DIR/transfer/horasan_dump.sql" ]]; then
  HORASAN_DUMP="$BUNDLE_DIR/transfer/horasan_dump.sql"
fi

if [[ ! -f "$DEMO_COUCH_JSON" && -n "$BUNDLE_DIR" && -f "$BUNDLE_DIR/transfer/demo_db.json" ]]; then
  DEMO_COUCH_JSON="$BUNDLE_DIR/transfer/demo_db.json"
fi

if [[ ! -f "$TREEVIEW_COUCH_JSON" && -n "$BUNDLE_DIR" && -f "$BUNDLE_DIR/transfer/treeviewstate_db.json" ]]; then
  TREEVIEW_COUCH_JSON="$BUNDLE_DIR/transfer/treeviewstate_db.json"
fi

import_couch_db() {
  local db_name="$1"
  local path="$2"

  python3 - "$db_name" "$path" "$COUCHDB_BOOTSTRAP_USER" "$COUCHDB_BOOTSTRAP_PASSWORD" <<'PY'
import base64
import json
import sys
import urllib.error
import urllib.request

db_name = sys.argv[1]
path = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]
auth = base64.b64encode(f"{user}:{password}".encode()).decode()
headers = {"Authorization": f"Basic {auth}", "Content-Type": "application/json"}

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
}

assert_file_exists "$DEMO_DUMP" "Demo dump"
assert_file_exists "$HORASAN_DUMP" "Horasan dump"
assert_not_lfs_pointer "$DEMO_DUMP"
assert_not_lfs_pointer "$HORASAN_DUMP"

set_env "ALLOWED_HOSTS" "${SERVER_IP} localhost 127.0.0.1 django frontend client"
set_env "APP_API_BASE_URL" "http://${SERVER_IP}:8000"
set_env "BACKEND_BASE_URL" "http://${SERVER_IP}:8000"
set_env "BASE_URL" "http://${SERVER_IP}"
set_env "REACT_APP_API_BASE_URL" "http://${SERVER_IP}:8000"
set_env "REACT_APP_WS_BASE_URL" "ws://${SERVER_IP}:8000"
set_env "REACT_APP_COUCHDB_URL" "http://${SERVER_IP}:5984/"
set_env "REACT_APP_INFLUX_URL" "http://${SERVER_IP}:8086"
set_env "NIFI_API_URL" "http://${SERVER_IP}:8082/nifi-api/"
set_env "MQTT_BROKER_ADDRESS" "${SERVER_IP}"
set_env "DIAGNOSTIC_LAYER_NAME" "${TARGET_LAYER}"
set_env "REACT_APP_LAYER_NAME" "${TARGET_LAYER}"
set_env "COMPANY_NAME" "${TARGET_LAYER}"
set_env "LAYER_DB_NAME" "$(printf '%s' "$TARGET_LAYER" | tr '[:upper:]' '[:lower:]')"
set_env "LEGACY_LAYER_DB_NAME" "$(printf '%s' "$TARGET_LAYER" | tr '[:upper:]' '[:lower:]')"
set_env "COUCHDB_USER" "$(get_env_value "COUCHDB_USER" "admin")"
set_env "COUCHDB_PASSWORD" "$(get_env_value "COUCHDB_PASSWORD" "change-me")"
set_env "DIAGNOSTIC_DJANGO_HEALTH_URL" "http://django:8000/api/v1/health/"
set_env "DIAGNOSTIC_PROBE_INTERVAL_SECONDS" "60"

COUCHDB_BOOTSTRAP_USER="$(get_env_value "COUCHDB_USER" "admin")"
COUCHDB_BOOTSTRAP_PASSWORD="$(get_env_value "COUCHDB_PASSWORD" "change-me")"

OFFLINE_MODE=0
if load_offline_images; then
  OFFLINE_MODE=1
fi

mapfile -t DB_SERVICES < <(db_services)
mapfile -t DATA_SERVICES < <(data_services)
mapfile -t DATA_BUILD_SERVICES < <(data_build_services || true)
mapfile -t APP_CORE_SERVICES < <(app_core_services)
mapfile -t APP_DIAGNOSTIC_SERVICES < <(app_diagnostic_services || true)

docker network inspect app_net >/dev/null 2>&1 || docker network create app_net >/dev/null

docker compose --env-file "$ENV_FILE" -f "$DB_FILE" up -d "${DB_SERVICES[@]}"
if [[ "$OFFLINE_MODE" == "1" ]]; then
  docker compose --env-file "$ENV_FILE" -f "$DATA_FILE" up -d --no-build "${DATA_SERVICES[@]}"
else
  if (( ${#DATA_BUILD_SERVICES[@]} > 0 )); then
    docker compose --env-file "$ENV_FILE" -f "$DATA_FILE" build "${DATA_BUILD_SERVICES[@]}"
  fi
  docker compose --env-file "$ENV_FILE" -f "$DATA_FILE" up -d "${DATA_SERVICES[@]}"
fi

chmod +x "$RESTORE_SCRIPT"
"$RESTORE_SCRIPT" "$DEMO_DUMP" "$HORASAN_DUMP"

if [[ -f "$DEMO_COUCH_JSON" || -f "$TREEVIEW_COUCH_JSON" ]]; then
  if should_reset_couch_volume; then
    recreate_couch_volume
  fi

  wait_for_couch

  if [[ -f "$DEMO_COUCH_JSON" ]]; then
    import_couch_db "demo" "$DEMO_COUCH_JSON"
  fi

  if [[ -f "$TREEVIEW_COUCH_JSON" ]]; then
    import_couch_db "treeviewstate" "$TREEVIEW_COUCH_JSON"
  fi
fi

if [[ "$OFFLINE_MODE" == "1" ]]; then
  docker compose --env-file "$ENV_FILE" -f "$APP_FILE" run --rm --no-deps django bash -lc "cd backend && python manage.py migrate"
  run_optional_layer_normalizers
  docker compose --env-file "$ENV_FILE" -f "$APP_FILE" up -d --no-build "${APP_CORE_SERVICES[@]}"
  if (( ${#APP_DIAGNOSTIC_SERVICES[@]} > 0 )); then
    docker compose --env-file "$ENV_FILE" -f "$APP_FILE" up -d --no-build "${APP_DIAGNOSTIC_SERVICES[@]}"
  fi
else
  docker compose --env-file "$ENV_FILE" -f "$APP_FILE" build django frontend
  docker compose --env-file "$ENV_FILE" -f "$APP_FILE" run --rm django bash -lc "cd backend && python manage.py migrate"
  run_optional_layer_normalizers
  docker compose --env-file "$ENV_FILE" -f "$APP_FILE" up -d "${APP_CORE_SERVICES[@]}"
  if (( ${#APP_DIAGNOSTIC_SERVICES[@]} > 0 )); then
    docker compose --env-file "$ENV_FILE" -f "$APP_FILE" up -d "${APP_DIAGNOSTIC_SERVICES[@]}"
  fi
fi

cat <<EOF
Bootstrap completed for ${SERVER_IP}.

Stack mode: ${STACK_MODE}

Expected endpoints:
  http://${SERVER_IP}/
  http://${SERVER_IP}:8000/api/v1/health/
EOF
