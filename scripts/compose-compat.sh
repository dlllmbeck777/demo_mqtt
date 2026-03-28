#!/usr/bin/env bash

resolve_compose_runtime() {
  if docker compose version >/dev/null 2>&1; then
    COMPOSE_RUNTIME=(docker compose)
  elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_RUNTIME=(docker-compose)
  else
    echo "Docker Compose is not available. Install either 'docker compose' or 'docker-compose'."
    exit 1
  fi

  if "${COMPOSE_RUNTIME[@]}" --help 2>&1 | grep -q -- "--env-file"; then
    COMPOSE_SUPPORTS_ENV_FILE=1
  else
    COMPOSE_SUPPORTS_ENV_FILE=0
  fi
}

ensure_compose_env_compat() {
  local compose_file="$1"
  local compose_dir

  if [[ -z "${ENV_FILE:-}" || ! -f "${ENV_FILE:-}" ]]; then
    return 0
  fi

  compose_dir="$(cd "$(dirname "$compose_file")" && pwd)"
  if [[ "$compose_dir/.env" != "$ENV_FILE" ]]; then
    cp -f "$ENV_FILE" "$compose_dir/.env"
  fi
}

compose_cmd() {
  local args=("$@")
  local compose_file=""
  local index

  if [[ -z "${COMPOSE_SUPPORTS_ENV_FILE:-}" ]]; then
    echo "Compose runtime is not initialized. Call resolve_compose_runtime first."
    exit 1
  fi

  for (( index=0; index<${#args[@]}; index++ )); do
    if [[ "${args[$index]}" == "-f" ]] && (( index + 1 < ${#args[@]} )); then
      compose_file="${args[$((index + 1))]}"
      break
    fi
  done

  if [[ "$COMPOSE_SUPPORTS_ENV_FILE" == "1" && -n "${ENV_FILE:-}" && -f "${ENV_FILE:-}" ]]; then
    "${COMPOSE_RUNTIME[@]}" --env-file "$ENV_FILE" "${args[@]}"
    return
  fi

  if [[ -n "$compose_file" ]]; then
    ensure_compose_env_compat "$compose_file"
  fi

  "${COMPOSE_RUNTIME[@]}" "${args[@]}"
}
