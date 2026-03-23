#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-${BUNDLE_MODE:-pipeline}}"
BUNDLE_DIR="${BUNDLE_DIR:-$ROOT_DIR/offline_bundle}"
ENV_FILE="$ROOT_DIR/docker-compose/.env"
APP_FILE="$ROOT_DIR/docker-compose/app/docker-compose.yml"
DATA_FILE="$ROOT_DIR/docker-compose/data/docker-compose.yml"
PROJECT_ARCHIVE="$BUNDLE_DIR/demo_mqtt-project.tar.gz"

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
rm -f "$BUNDLE_DIR"/*.tar "$PROJECT_ARCHIVE"

light_images=(
  "postgres:11.20-alpine"
  "redis:latest"
  "redislabs/redistimeseries:latest"
  "couchdb:latest"
  "mongo:4.2"
  "influxdb:latest"
  "nginx:latest"
  "app-django:latest"
  "app-frontend:latest"
)

pipeline_images=(
  "eclipse-mosquitto:2"
  "confluentinc/cp-zookeeper:6.1.1"
  "confluentinc/cp-enterprise-kafka:5.3.1"
  "nordal/nifi-linux:latest"
  "mqtt-publisher:latest"
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

build_local_images() {
  echo "Building local app images"
  docker compose --env-file "$ENV_FILE" -f "$APP_FILE" build django frontend

  if [[ "$MODE" == "pipeline" || "$MODE" == "full" ]]; then
    echo "Building pipeline simulation images"
    docker compose --env-file "$ENV_FILE" -f "$DATA_FILE" build nifi mqtt-publisher
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
SERVER_IP="${SERVER_IP:-$(hostname -I | awk '{print $1}')}"
TARGET_LAYER="${TARGET_LAYER:-Horasan}"
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
chmod +x scripts/bootstrap-historical-stack.sh scripts/restore-demo-horasan.sh

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
build_bundle_scripts

cat <<EOF
Offline bundle created.

Mode: $MODE
Bundle dir: $BUNDLE_DIR

On the target server:
  1. copy the whole bundle directory
  2. run: bash $BUNDLE_DIR/deploy-from-bundle.sh

Optional:
  SERVER_IP=YOUR_SERVER_IP TARGET_LAYER=Horasan bash $BUNDLE_DIR/deploy-from-bundle.sh
EOF
