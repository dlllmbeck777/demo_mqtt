#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-${BUNDLE_MODE:-pipeline}}"
BUNDLE_DIR="${BUNDLE_DIR:-$ROOT_DIR/offline_bundle}"
ENV_FILE="$ROOT_DIR/docker-compose/.env"
APP_FILE="${APP_FILE:-$ROOT_DIR/docker-compose/app/docker-compose.production.yml}"
DATA_FILE="$ROOT_DIR/docker-compose/data/docker-compose.yml"
PROJECT_ARCHIVE="$BUNDLE_DIR/demo_mqtt-project.tar.gz"
BUNDLE_ENV_SNAPSHOT="$BUNDLE_DIR/docker-compose.env"
IMAGE_LIST_FILE="$BUNDLE_DIR/images.txt"
VERSION_FILE="$BUNDLE_DIR/VERSION.txt"
MANIFEST_FILE="$BUNDLE_DIR/bundle-manifest.json"

case "$MODE" in
  light|pipeline|full)
    ;;
  *)
    echo "Unsupported mode: $MODE"
    echo "Usage: $0 [light|pipeline|full]"
    exit 1
    ;;
esac

if [[ ! -f "$ENV_FILE" ]]; then
  cp "$ROOT_DIR/docker-compose/.env.example" "$ENV_FILE"
fi

mkdir -p "$BUNDLE_DIR/transfer"
rm -f "$BUNDLE_DIR"/*.tar "$PROJECT_ARCHIVE" "$BUNDLE_ENV_SNAPSHOT" "$IMAGE_LIST_FILE" "$VERSION_FILE" "$MANIFEST_FILE"

light_images=(
  "postgres:11.20-alpine"
  "redis:latest"
  "redislabs/redistimeseries:latest"
  "couchdb:3.5.1"
  "mongo:4.2"
  "influxdb:latest"
  "app-django:latest"
  "app-client-prod:latest"
)

pipeline_images=(
  "eclipse-mosquitto:2"
  "confluentinc/cp-zookeeper:6.1.1"
  "confluentinc/cp-enterprise-kafka:5.3.1"
  "nordal/nifi-linux:latest"
)

full_images=(
  "rabbitmq:3-management"
  "data-connect:latest"
  "confluentinc/cp-enterprise-control-center:5.3.1"
  "obsidiandynamics/kafdrop:latest"
  "dpage/pgadmin4:latest"
  "mongo-express:latest"
  "docker.elastic.co/elasticsearch/elasticsearch:7.12.0"
)

docker_pull_if_missing() {
  local image="$1"
  if ! docker image inspect "$image" >/dev/null 2>&1; then
    echo "Pulling $image"
    docker pull "$image"
  fi
}

git_value_or_default() {
  local command="$1"
  local default_value="$2"

  if git -C "$ROOT_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    eval "$command" 2>/dev/null || printf '%s' "$default_value"
  else
    printf '%s' "$default_value"
  fi
}

build_local_images() {
  echo "Building local app images"
  docker compose --env-file "$ENV_FILE" -f "$APP_FILE" build django client

  if [[ "$MODE" == "pipeline" || "$MODE" == "full" ]]; then
    echo "Building pipeline simulation images"
    docker compose --env-file "$ENV_FILE" -f "$DATA_FILE" build nifi
  fi

  if [[ "$MODE" == "full" ]]; then
    echo "Building full data-stack images"
    docker compose --env-file "$ENV_FILE" -f "$DATA_FILE" build connect
  fi
}

tar_name_for_image() {
  local image="$1"
  local name
  name="${image//\//_}"
  name="${name//:/_}"
  name="${name//@/_}"
  printf '%s.tar' "$name"
}

save_image() {
  local image="$1"
  local tar_path="$BUNDLE_DIR/$(tar_name_for_image "$image")"
  echo "Saving $image -> $(basename "$tar_path")"
  docker image save -o "$tar_path" "$image"
}

copy_transfer_file() {
  local source_path="$1"
  local target_path="$BUNDLE_DIR/transfer/$(basename "$source_path")"

  if [[ -f "$source_path" ]]; then
    cp -f "$source_path" "$target_path"
    echo "Copied $(basename "$source_path")"
  else
    echo "Skipped missing $(basename "$source_path")"
  fi
}

copy_env_snapshot() {
  if [[ -f "$ENV_FILE" ]]; then
    cp -f "$ENV_FILE" "$BUNDLE_ENV_SNAPSHOT"
    echo "Copied docker-compose/.env"
  fi
}

write_image_list() {
  printf '%s\n' "${images[@]}" > "$IMAGE_LIST_FILE"
}

write_bundle_metadata() {
  local created_at
  local git_branch
  local git_commit
  local git_dirty
  local release_name

  created_at="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  git_branch="$(git_value_or_default "git -C \"$ROOT_DIR\" branch --show-current" "unknown")"
  git_commit="$(git_value_or_default "git -C \"$ROOT_DIR\" rev-parse HEAD" "unknown")"

  if git -C "$ROOT_DIR" diff --quiet --ignore-submodules HEAD -- 2>/dev/null && \
     git -C "$ROOT_DIR" diff --cached --quiet --ignore-submodules -- 2>/dev/null; then
    git_dirty="false"
  else
    git_dirty="true"
  fi

  release_name="${RELEASE_NAME:-offline-${MODE}-$(printf '%s' "$git_commit" | cut -c1-12)-$(date -u +%Y%m%d-%H%M%S)}"

  cat > "$VERSION_FILE" <<EOF
release_name=$release_name
mode=$MODE
created_at_utc=$created_at
git_branch=$git_branch
git_commit=$git_commit
git_dirty=$git_dirty
project_archive=$(basename "$PROJECT_ARCHIVE")
env_snapshot=$(basename "$BUNDLE_ENV_SNAPSHOT")
EOF

  python3 - "$MANIFEST_FILE" "$release_name" "$MODE" "$created_at" "$git_branch" "$git_commit" "$git_dirty" "$PROJECT_ARCHIVE" "$BUNDLE_ENV_SNAPSHOT" "$IMAGE_LIST_FILE" <<'PY'
import json
import os
import sys

manifest_path, release_name, mode, created_at, git_branch, git_commit, git_dirty, archive_path, env_snapshot, image_list_path = sys.argv[1:]

with open(image_list_path, "r", encoding="utf-8") as handle:
    images = [line.strip() for line in handle if line.strip()]

payload = {
    "release_name": release_name,
    "mode": mode,
    "created_at_utc": created_at,
    "git_branch": git_branch,
    "git_commit": git_commit,
    "git_dirty": git_dirty.lower() == "true",
    "project_archive": os.path.basename(archive_path),
    "env_snapshot": os.path.basename(env_snapshot),
    "images": images,
}

with open(manifest_path, "w", encoding="utf-8") as handle:
    json.dump(payload, handle, indent=2)
    handle.write("\n")
PY
}

build_bundle_scripts() {
  cat > "$BUNDLE_DIR/load-all-images.sh" <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail

BUNDLE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
shopt -s nullglob

for tar_file in "$BUNDLE_DIR"/*.tar; do
  echo "Loading $(basename "$tar_file")"
  docker load -i "$tar_file"
done
EOF
  chmod +x "$BUNDLE_DIR/load-all-images.sh"

  cat > "$BUNDLE_DIR/deploy-from-bundle.sh" <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail

BUNDLE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_ROOT="${DEPLOY_ROOT:-$HOME/offline_bundle_deploy}"
PROJECT_DIR="${PROJECT_DIR:-$DEPLOY_ROOT/demo_mqtt}"
PROJECT_ARCHIVE="$BUNDLE_DIR/demo_mqtt-project.tar.gz"
ENV_SNAPSHOT="$BUNDLE_DIR/docker-compose.env"
VERSION_FILE="$BUNDLE_DIR/VERSION.txt"
SERVER_IP="${SERVER_IP:-$(hostname -I | awk '{print $1}')}"
TARGET_LAYER="${TARGET_LAYER:-Inkai}"
STACK_MODE="${STACK_MODE:-__DEFAULT_STACK_MODE__}"

if [[ ! -f "$PROJECT_ARCHIVE" ]]; then
  echo "Project archive not found: $PROJECT_ARCHIVE"
  exit 1
fi

if [[ ! -f "$BUNDLE_DIR/transfer/demo_dump.sql" || ! -f "$BUNDLE_DIR/transfer/horasan_dump.sql" ]]; then
  echo "Required PostgreSQL dumps were not found in $BUNDLE_DIR/transfer"
  exit 1
fi

rm -rf "$PROJECT_DIR"
mkdir -p "$PROJECT_DIR"
tar -xzf "$PROJECT_ARCHIVE" -C "$PROJECT_DIR"

cd "$PROJECT_DIR"

if [[ -f "$ENV_SNAPSHOT" ]]; then
  mkdir -p docker-compose
  cp -f "$ENV_SNAPSHOT" docker-compose/.env
fi

chmod +x scripts/bootstrap-historical-stack.sh scripts/restore-demo-horasan.sh

if [[ -f "$VERSION_FILE" ]]; then
  echo "Deploying bundle:"
  cat "$VERSION_FILE"
fi

BUNDLE_DIR="$BUNDLE_DIR" TARGET_LAYER="$TARGET_LAYER" STACK_MODE="$STACK_MODE" \
  ./scripts/bootstrap-historical-stack.sh \
  "$SERVER_IP" \
  "$BUNDLE_DIR/transfer/demo_dump.sql" \
  "$BUNDLE_DIR/transfer/horasan_dump.sql"
EOF
  sed -i "s/__DEFAULT_STACK_MODE__/$MODE/g" "$BUNDLE_DIR/deploy-from-bundle.sh"
  chmod +x "$BUNDLE_DIR/deploy-from-bundle.sh"
}

archive_project() {
  echo "Archiving project source"
  tar \
    --exclude='.git' \
    --exclude='offline_bundle' \
    --exclude='frontend/node_modules' \
    --exclude='docker-compose/db/data' \
    --exclude='docker-compose/data/log' \
    -czf "$PROJECT_ARCHIVE" \
    -C "$ROOT_DIR" .
}

build_local_images

images=("${light_images[@]}")
if [[ "$MODE" == "pipeline" || "$MODE" == "full" ]]; then
  images+=("${pipeline_images[@]}")
fi
if [[ "$MODE" == "full" ]]; then
  images+=("${full_images[@]}")
fi

for image in "${images[@]}"; do
  docker_pull_if_missing "$image"
done

for image in "${images[@]}"; do
  save_image "$image"
done

copy_transfer_file "$ROOT_DIR/transfer/demo_dump.sql"
copy_transfer_file "$ROOT_DIR/transfer/horasan_dump.sql"
copy_transfer_file "$ROOT_DIR/transfer/demo_db.json"
copy_transfer_file "$ROOT_DIR/transfer/treeviewstate_db.json"

archive_project
copy_env_snapshot
write_image_list
write_bundle_metadata
build_bundle_scripts

cat <<EOF
Offline bundle created.

Mode: $MODE
Bundle dir: $BUNDLE_DIR
Version file: $VERSION_FILE
Manifest: $MANIFEST_FILE

On the target server:
  1. copy the whole bundle directory
  2. run: bash $BUNDLE_DIR/deploy-from-bundle.sh

Optional:
  SERVER_IP=YOUR_SERVER_IP TARGET_LAYER=Inkai bash $BUNDLE_DIR/deploy-from-bundle.sh
EOF
