#!/usr/bin/env bash
set -euo pipefail

CONF_DIR="/opt/nifi/nifi-current/conf"
BUNDLED_FLOW_DIR="/opt/nifi/bootstrap-flow"
FLOW_MODE="${NIFI_BUNDLED_FLOW_MODE:-replace}"

echo "[nifi-flow] startup mode=${FLOW_MODE}"

copy_flow() {
  local src="$1"
  local dst="$2"

  if [[ ! -f "$src" ]]; then
    return 0
  fi

  case "$FLOW_MODE" in
    disabled)
      echo "[nifi-flow] bundled flow import disabled"
      return 0
      ;;
    replace)
      cp "$src" "$dst"
      echo "[nifi-flow] replaced $(basename "$dst") from bundled flow"
      ;;
    if-missing)
      if [[ ! -s "$dst" ]]; then
        cp "$src" "$dst"
        echo "[nifi-flow] installed missing $(basename "$dst") from bundled flow"
      else
        echo "[nifi-flow] keeping existing $(basename "$dst")"
      fi
      ;;
    *)
      echo "[nifi-flow] unsupported NIFI_BUNDLED_FLOW_MODE=$FLOW_MODE"
      exit 1
      ;;
  esac
}

mkdir -p "$CONF_DIR"

copy_flow "$BUNDLED_FLOW_DIR/flow.json.gz" "$CONF_DIR/flow.json.gz"
copy_flow "$BUNDLED_FLOW_DIR/flow.xml.gz" "$CONF_DIR/flow.xml.gz"

cd /opt/nifi/nifi-current/bin
exec ../scripts/start.sh
