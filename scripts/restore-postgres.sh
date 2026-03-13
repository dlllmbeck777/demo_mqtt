#!/usr/bin/env bash

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 /path/to/ligeia.dump|/path/to/ligeia.sql"
  exit 1
fi

DUMP_PATH="$1"
CONTAINER_NAME="${POSTGRES_CONTAINER_NAME:-ligeiaai-postgres-1}"
TEMP_PATH="/tmp/restore-input"

if [[ ! -f "$DUMP_PATH" ]]; then
  echo "Dump file not found: $DUMP_PATH"
  exit 1
fi

docker compose up -d postgres >/dev/null
docker cp "$DUMP_PATH" "${CONTAINER_NAME}:${TEMP_PATH}"

case "$DUMP_PATH" in
  *.sql)
    docker exec -i "$CONTAINER_NAME" sh -lc \
      'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f "'"${TEMP_PATH}"'"'
    ;;
  *)
    docker exec -i "$CONTAINER_NAME" sh -lc \
      'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner --no-privileges "'"${TEMP_PATH}"'"'
    ;;
esac

docker exec -i "$CONTAINER_NAME" rm -f "$TEMP_PATH"
docker compose restart django >/dev/null

echo "PostgreSQL restore completed."
