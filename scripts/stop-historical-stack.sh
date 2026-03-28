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

resolve_compose_runtime

compose_cmd -f "$APP_FILE" down --remove-orphans
compose_cmd -f "$DATA_FILE" down --remove-orphans
compose_cmd -f "$DB_FILE" down --remove-orphans
