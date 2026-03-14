#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 /path/to/demo_dump.sql /path/to/horasan_dump.sql"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_DUMP="$1"
LAYER_DUMP="$2"
ENV_FILE="${ROOT_DIR}/.env"

if [[ ! -f "$DEFAULT_DUMP" ]]; then
  echo "Default dump not found: $DEFAULT_DUMP"
  exit 1
fi

if [[ ! -f "$LAYER_DUMP" ]]; then
  echo "Layer dump not found: $LAYER_DUMP"
  exit 1
fi

get_env_value() {
  local key="$1"

  if [[ ! -f "$ENV_FILE" ]]; then
    return 0
  fi

  sed -n "s/^${key}=//p" "$ENV_FILE" | tail -n 1 | tr -d '\r'
}

CONTAINER_NAME="${POSTGRES_CONTAINER_NAME:-$(get_env_value POSTGRES_CONTAINER_NAME)}"
CONTAINER_NAME="${CONTAINER_NAME:-ligeiaai-postgres-1}"
PG_USER_NAME="${PG_USER:-$(get_env_value PG_USER)}"
PG_USER_NAME="${PG_USER_NAME:-postgres}"
TARGET_PASSWORD="${TARGET_POSTGRES_PASSWORD:-manager}"
DEFAULT_DB_NAME="${DEFAULT_DB_NAME:-$(get_env_value DEFAULT_DB_NAME)}"
DEFAULT_DB_NAME="${DEFAULT_DB_NAME:-demo}"
LAYER_DB_NAME="${LAYER_DB_NAME:-$(get_env_value LAYER_DB_NAME)}"
LAYER_DB_NAME="${LAYER_DB_NAME:-horasan}"

docker compose up -d postgres >/dev/null

docker cp "$DEFAULT_DUMP" "${CONTAINER_NAME}:/tmp/default_restore.sql"
docker cp "$LAYER_DUMP" "${CONTAINER_NAME}:/tmp/layer_restore.sql"

docker exec "$CONTAINER_NAME" psql -U "$PG_USER_NAME" -d postgres -c "ALTER USER \"$PG_USER_NAME\" WITH PASSWORD '${TARGET_PASSWORD}';"
docker exec "$CONTAINER_NAME" psql -U "$PG_USER_NAME" -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname IN ('${DEFAULT_DB_NAME}', '${LAYER_DB_NAME}') AND pid <> pg_backend_pid();"
docker exec "$CONTAINER_NAME" dropdb -U "$PG_USER_NAME" --if-exists "$DEFAULT_DB_NAME"
docker exec "$CONTAINER_NAME" createdb -U "$PG_USER_NAME" "$DEFAULT_DB_NAME"
docker exec "$CONTAINER_NAME" dropdb -U "$PG_USER_NAME" --if-exists "$LAYER_DB_NAME"
docker exec "$CONTAINER_NAME" createdb -U "$PG_USER_NAME" "$LAYER_DB_NAME"

docker exec "$CONTAINER_NAME" psql -U "$PG_USER_NAME" -d "$DEFAULT_DB_NAME" -f /tmp/default_restore.sql
docker exec "$CONTAINER_NAME" psql -U "$PG_USER_NAME" -d "$LAYER_DB_NAME" -f /tmp/layer_restore.sql
docker exec "$CONTAINER_NAME" rm -f /tmp/default_restore.sql /tmp/layer_restore.sql

docker compose restart django >/dev/null

cat <<EOF
Restore completed.

Make sure your .env matches the restored databases:
PG_DB=${DEFAULT_DB_NAME}
PG_USER=${PG_USER_NAME}
PG_PASS=${TARGET_PASSWORD}

Then restart the app stack if needed:
docker compose up -d django frontend client
EOF
