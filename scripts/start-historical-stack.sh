#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/scripts/compose-compat.sh"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/docker-compose/.env}"
APP_FILE="${APP_FILE:-$ROOT_DIR/docker-compose/app/docker-compose.production.yml}"
DB_FILE="$ROOT_DIR/docker-compose/db/docker-compose.yml"
DATA_FILE="$ROOT_DIR/docker-compose/data/docker-compose.yml"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "env file not found: $ENV_FILE"
  echo "copy docker-compose/.env.example to docker-compose/.env first"
  exit 1
fi

resolve_compose_runtime

docker network inspect app_net >/dev/null 2>&1 || docker network create app_net >/dev/null

compose_cmd -f "$DB_FILE" up -d
compose_cmd -f "$DATA_FILE" up -d
compose_cmd -f "$APP_FILE" build django client
compose_cmd -f "$APP_FILE" run --rm django bash -lc "cd /django/backend && python manage.py migrate"
compose_cmd -f "$APP_FILE" up -d
