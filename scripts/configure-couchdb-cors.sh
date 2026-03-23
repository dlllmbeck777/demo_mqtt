#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${1:-$ROOT_DIR/docker-compose/.env}"

read_env_value() {
  local key="$1"
  local default_value="$2"

  if [[ -f "$ENV_FILE" ]]; then
    local line
    line="$(grep -E "^${key}=" "$ENV_FILE" | tail -n 1 || true)"
    if [[ -n "$line" ]]; then
      printf '%s' "${line#*=}"
      return 0
    fi
  fi

  printf '%s' "$default_value"
}

COUCHDB_USER="${COUCHDB_USER:-$(read_env_value COUCHDB_USER admin)}"
COUCHDB_PASSWORD="${COUCHDB_PASSWORD:-$(read_env_value COUCHDB_PASSWORD change-me)}"
COUCHDB_CONFIG_URL="${COUCHDB_CONFIG_URL:-$(read_env_value COUCHDB_CONFIG_URL http://127.0.0.1:5984)}"
COUCHDB_CORS_ORIGINS="${COUCHDB_CORS_ORIGINS:-$(read_env_value COUCHDB_CORS_ORIGINS *)}"
COUCHDB_CORS_METHODS="${COUCHDB_CORS_METHODS:-$(read_env_value COUCHDB_CORS_METHODS 'GET, PUT, POST, HEAD, DELETE, OPTIONS')}"
COUCHDB_CORS_HEADERS="${COUCHDB_CORS_HEADERS:-$(read_env_value COUCHDB_CORS_HEADERS 'accept, authorization, content-type, origin, referer, x-csrf-token, x-requested-with')}"
COUCHDB_CORS_MAX_AGE="${COUCHDB_CORS_MAX_AGE:-$(read_env_value COUCHDB_CORS_MAX_AGE 3600)}"
COUCHDB_CORS_CREDENTIALS="${COUCHDB_CORS_CREDENTIALS:-$(read_env_value COUCHDB_CORS_CREDENTIALS false)}"

curl_json() {
  local method="$1"
  local path="$2"
  local body="$3"

  curl --silent --show-error --fail \
    --user "${COUCHDB_USER}:${COUCHDB_PASSWORD}" \
    --header "Content-Type: application/json" \
    --request "$method" \
    --data "$body" \
    "${COUCHDB_CONFIG_URL}${path}" >/dev/null
}

ensure_db() {
  local name="$1"
  local code

  code="$(
    curl --silent --show-error \
      --output /dev/null \
      --write-out "%{http_code}" \
      --user "${COUCHDB_USER}:${COUCHDB_PASSWORD}" \
      --request PUT \
      "${COUCHDB_CONFIG_URL}/${name}"
  )"

  case "$code" in
    201|202|412)
      return 0
      ;;
    *)
      echo "Unable to ensure CouchDB database '${name}', HTTP ${code}"
      return 1
      ;;
  esac
}

curl --silent --show-error --fail \
  --user "${COUCHDB_USER}:${COUCHDB_PASSWORD}" \
  "${COUCHDB_CONFIG_URL}/_up" >/dev/null

ensure_db "_users"
ensure_db "_replicator"
ensure_db "_global_changes"

curl_json PUT "/_node/_local/_config/chttpd/enable_cors" '"true"'
curl_json PUT "/_node/_local/_config/cors/origins" "\"${COUCHDB_CORS_ORIGINS}\""
curl_json PUT "/_node/_local/_config/cors/credentials" "\"${COUCHDB_CORS_CREDENTIALS}\""
curl_json PUT "/_node/_local/_config/cors/methods" "\"${COUCHDB_CORS_METHODS}\""
curl_json PUT "/_node/_local/_config/cors/headers" "\"${COUCHDB_CORS_HEADERS}\""
curl_json PUT "/_node/_local/_config/cors/max_age" "\"${COUCHDB_CORS_MAX_AGE}\""

echo "CouchDB CORS configured at ${COUCHDB_CONFIG_URL}"
