#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_IP="${1:-65.109.174.58}"
if [[ $# -gt 0 ]]; then
  shift
fi

TARGET_LAYER="${TARGET_LAYER:-${DIAGNOSTIC_LAYER_NAME:-STD}}"
export TARGET_LAYER

exec "$ROOT_DIR/scripts/bootstrap-historical-stack.sh" "$TARGET_IP" "$@"
