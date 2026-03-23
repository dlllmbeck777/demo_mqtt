#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 /path/to/demo_dump.sql /path/to/horasan_dump.sql"
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_DUMP="$1"
LAYER_DUMP="$2"
ENV_FILE="${ROOT_DIR}/docker-compose/.env"
DB_FILE="${ROOT_DIR}/docker-compose/db/docker-compose.yml"
APP_FILE="${APP_FILE:-${ROOT_DIR}/docker-compose/app/docker-compose.production.yml}"

if [[ ! -f "$ENV_FILE" ]]; then
  ENV_FILE="${ROOT_DIR}/.env"
fi

if [[ ! -f "$DEFAULT_DUMP" ]]; then
  echo "Default dump not found: $DEFAULT_DUMP"
  exit 1
fi

if [[ ! -f "$LAYER_DUMP" ]]; then
  echo "Layer dump not found: $LAYER_DUMP"
  exit 1
fi

assert_not_lfs_pointer() {
  local path="$1"

  if head -n 1 "$path" | grep -q "https://git-lfs.github.com/spec/v1"; then
    echo "Dump file is still a Git LFS pointer: $path"
    echo "Run 'git lfs pull' or restore the real file from your local backup before importing."
    exit 1
  fi
}

assert_not_lfs_pointer "$DEFAULT_DUMP"
assert_not_lfs_pointer "$LAYER_DUMP"

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
LAYER_DB_NAME="${LAYER_DB_NAME:-$(get_env_value LEGACY_LAYER_DB_NAME)}"
LAYER_DB_NAME="${LAYER_DB_NAME:-$(get_env_value DIAGNOSTIC_LAYER_NAME)}"
LAYER_DB_NAME="${LAYER_DB_NAME:-inkai}"
LAYER_DB_NAME="$(printf '%s' "$LAYER_DB_NAME" | tr '[:upper:]' '[:lower:]')"
TARGET_LAYER_NAME="${TARGET_LAYER_NAME:-$(get_env_value DIAGNOSTIC_LAYER_NAME)}"
TARGET_LAYER_NAME="${TARGET_LAYER_NAME:-$(get_env_value COMPANY_NAME)}"
TARGET_LAYER_NAME="${TARGET_LAYER_NAME:-Inkai}"

normalize_layer_metadata() {
  docker exec -i "$CONTAINER_NAME" psql -v ON_ERROR_STOP=1 -U "$PG_USER_NAME" -d "$DEFAULT_DB_NAME" <<SQL
BEGIN;

UPDATE public.layer_layer
SET "DB_SETTINGS" = jsonb_set(
      COALESCE("DB_SETTINGS", '{}'::jsonb),
      '{NAME}',
      to_jsonb('${DEFAULT_DB_NAME}'::text),
      true
    )
WHERE "LAYER_NAME" = 'STD';

INSERT INTO public.layer_layer (
  "LAYER_NAME","DATA_SOURCE","LAYER_LEVEL","DB_SETTINGS","LAST_UPDT_USER",
  "LAST_UPDT_DATE","VERSION","DB_ID","ROW_ID","STATUS","REV_GRP_ID"
)
SELECT
  '${TARGET_LAYER_NAME}',
  "DATA_SOURCE",
  "LAYER_LEVEL",
  jsonb_set(COALESCE("DB_SETTINGS", '{}'::jsonb), '{NAME}', to_jsonb('${LAYER_DB_NAME}'::text), true),
  "LAST_UPDT_USER",
  "LAST_UPDT_DATE",
  md5(random()::text || clock_timestamp()::text),
  "DB_ID",
  md5(random()::text || clock_timestamp()::text),
  "STATUS",
  md5(random()::text || clock_timestamp()::text)
FROM public.layer_layer
WHERE "LAYER_NAME" = 'Horasan'
  AND '${TARGET_LAYER_NAME}' <> 'Horasan'
  AND NOT EXISTS (
    SELECT 1
    FROM public.layer_layer existing
    WHERE existing."LAYER_NAME" = '${TARGET_LAYER_NAME}'
  );

UPDATE public.layer_layer
SET "DB_SETTINGS" = jsonb_set(
      COALESCE("DB_SETTINGS", '{}'::jsonb),
      '{NAME}',
      to_jsonb('${LAYER_DB_NAME}'::text),
      true
    )
WHERE "LAYER_NAME" = '${TARGET_LAYER_NAME}';

DELETE FROM public.users_user_layer_name old_link
USING public.users_user_layer_name new_link
WHERE old_link.user_id = new_link.user_id
  AND old_link.layer_id = 'Horasan'
  AND new_link.layer_id = '${TARGET_LAYER_NAME}'
  AND '${TARGET_LAYER_NAME}' <> 'Horasan';

UPDATE public.users_user_layer_name
SET layer_id = '${TARGET_LAYER_NAME}'
WHERE layer_id = 'Horasan'
  AND '${TARGET_LAYER_NAME}' <> 'Horasan';

UPDATE public.users_user
SET active_layer_id = '${TARGET_LAYER_NAME}'
WHERE active_layer_id = 'Horasan'
  AND '${TARGET_LAYER_NAME}' <> 'Horasan';

COMMIT;
SQL

  docker exec -i "$CONTAINER_NAME" psql -v ON_ERROR_STOP=1 -U "$PG_USER_NAME" -d "$LAYER_DB_NAME" <<SQL
BEGIN;

UPDATE public.layer_layer
SET "DB_SETTINGS" = jsonb_set(
      COALESCE("DB_SETTINGS", '{}'::jsonb),
      '{NAME}',
      to_jsonb('${DEFAULT_DB_NAME}'::text),
      true
    )
WHERE "LAYER_NAME" = 'STD';

INSERT INTO public.layer_layer (
  "LAYER_NAME","DATA_SOURCE","LAYER_LEVEL","DB_SETTINGS","LAST_UPDT_USER",
  "LAST_UPDT_DATE","VERSION","DB_ID","ROW_ID","STATUS","REV_GRP_ID"
)
SELECT
  '${TARGET_LAYER_NAME}',
  "DATA_SOURCE",
  "LAYER_LEVEL",
  jsonb_set(COALESCE("DB_SETTINGS", '{}'::jsonb), '{NAME}', to_jsonb('${LAYER_DB_NAME}'::text), true),
  "LAST_UPDT_USER",
  "LAST_UPDT_DATE",
  md5(random()::text || clock_timestamp()::text),
  "DB_ID",
  md5(random()::text || clock_timestamp()::text),
  "STATUS",
  md5(random()::text || clock_timestamp()::text)
FROM public.layer_layer
WHERE "LAYER_NAME" = 'Horasan'
  AND '${TARGET_LAYER_NAME}' <> 'Horasan'
  AND NOT EXISTS (
    SELECT 1
    FROM public.layer_layer existing
    WHERE existing."LAYER_NAME" = '${TARGET_LAYER_NAME}'
  );

UPDATE public.layer_layer
SET "DB_SETTINGS" = jsonb_set(
      COALESCE("DB_SETTINGS", '{}'::jsonb),
      '{NAME}',
      to_jsonb('${LAYER_DB_NAME}'::text),
      true
    )
WHERE "LAYER_NAME" = '${TARGET_LAYER_NAME}';

COMMIT;
SQL
}

docker compose --env-file "$ENV_FILE" -f "$DB_FILE" up -d postgres >/dev/null

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

normalize_layer_metadata

docker compose --env-file "$ENV_FILE" -f "$APP_FILE" restart django >/dev/null 2>&1 || true

cat <<EOF
Restore completed.

Make sure your .env matches the restored databases:
PG_DB=${DEFAULT_DB_NAME}
PG_USER=${PG_USER_NAME}
PG_PASS=${TARGET_PASSWORD}

Then restart the app stack if needed:
docker compose --env-file "$ENV_FILE" -f "$APP_FILE" up -d django client
EOF
