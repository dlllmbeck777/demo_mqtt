#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/docker-compose/.env}"
APP_FILE="${APP_FILE:-$ROOT_DIR/docker-compose/app/docker-compose.production.yml}"
DB_FILE="$ROOT_DIR/docker-compose/db/docker-compose.yml"
DATA_FILE="$ROOT_DIR/docker-compose/data/docker-compose.yml"

docker compose --env-file "$ENV_FILE" -f "$APP_FILE" down --remove-orphans
docker compose --env-file "$ENV_FILE" -f "$DATA_FILE" down --remove-orphans
docker compose --env-file "$ENV_FILE" -f "$DB_FILE" down --remove-orphans
