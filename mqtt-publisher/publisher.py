import json
import os
import random
import re
import time
from typing import Dict, List

import paho.mqtt.client as mqtt


def env_float(name: str, default: float) -> float:
    value = os.environ.get(name, "").strip()
    return float(value) if value else default


def env_int(name: str, default: int) -> int:
    value = os.environ.get(name, "").strip()
    return int(value) if value else default


DEFAULT_PUMPS = [
    ("OPZ", "P-2A"),
    ("OPZ", "P-2B"),
    ("OPZ", "P-2C"),
    ("OPZ", "P-3A"),
    ("OPZ", "P-3B"),
    ("OPZ", "P-3C"),
    ("OPZ", "P-85A"),
    ("OPZ", "P-85B"),
    ("OPZ", "P-85C"),
    ("SAT-1", "POS 151/1"),
    ("SAT-1", "POS 151/2"),
    ("SAT-1", "POS 151/3"),
    ("SAT-1", "POS 151/4"),
    ("SAT-1", "POS 161/1"),
    ("SAT-1", "POS 161/2"),
    ("SAT-1", "POS 161/3"),
    ("SAT-1", "POS 161/4"),
    ("SAT-2", "P3-P-101A"),
    ("SAT-2", "P3-P-101B"),
    ("SAT-2", "P3-P-101C"),
    ("SAT-2", "P3-P-111A"),
    ("SAT-2", "P3-P-111B"),
    ("SAT-2", "P3-P-111C"),
]


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def default_tag_id(layer: str, section: str, position: str) -> str:
    return f"plant_{slugify(layer)}.{slugify(section)}.{slugify(position)}_current"


def parse_pumps() -> List[Dict[str, str]]:
    layer_name = os.environ.get("MQTT_PUBLISHER_LAYER", "Inkai").strip() or "Inkai"
    raw = os.environ.get("MQTT_PUBLISHER_PUMPS", "").strip()
    items = raw.split(";") if raw else []
    pumps: List[Dict[str, str]] = []

    if not items:
        for section, position in DEFAULT_PUMPS:
            pumps.append(
                {
                    "section": section,
                    "position": position,
                    "id": default_tag_id(layer_name, section, position),
                }
            )
        return pumps

    for item in items:
        item = item.strip()
        if not item:
            continue

        parts = [part.strip() for part in item.split("|")]
        if len(parts) == 2:
            section, position = parts
            tag_id = default_tag_id(layer_name, section, position)
        elif len(parts) == 3:
            section, position, tag_id = parts
            tag_id = tag_id or default_tag_id(layer_name, section, position)
        else:
            raise RuntimeError(
                "MQTT_PUBLISHER_PUMPS item must be 'SECTION|POSITION' or 'SECTION|POSITION|TAG_ID'"
            )

        pumps.append({"section": section, "position": position, "id": tag_id})

    if not pumps:
        raise RuntimeError("MQTT_PUBLISHER_PUMPS is empty")

    return pumps


def publisher_items() -> List[Dict[str, str]]:
    raw = os.environ.get("MQTT_PUBLISHER_TAG_IDS", "").strip()
    if raw:
        tags = [item.strip() for item in raw.split(",") if item.strip()]
        if not tags:
            raise RuntimeError("MQTT_PUBLISHER_TAG_IDS is empty")
        return [{"section": "CUSTOM", "position": tag_id, "id": tag_id} for tag_id in tags]

    return parse_pumps()


HOST = os.environ.get("MQTT_PUBLISHER_HOST", "65.109.174.58").strip() or "65.109.174.58"
PORT = env_int("MQTT_PUBLISHER_PORT", 1883)
TOPIC = os.environ.get("MQTT_PUBLISHER_TOPIC", "iot-inkai-raw").strip() or "iot-inkai-raw"
INTERVAL_SECONDS = env_float("MQTT_PUBLISHER_INTERVAL_SECONDS", 5.0)
BASE_VALUE = env_float("MQTT_PUBLISHER_BASE_VALUE", 320.0)
JITTER = env_float("MQTT_PUBLISHER_JITTER", 10.0)
QOS = env_int("MQTT_PUBLISHER_QOS", 0)
USERNAME = os.environ.get("MQTT_PUBLISHER_USERNAME", "").strip()
PASSWORD = os.environ.get("MQTT_PUBLISHER_PASSWORD", "").strip()
CLIENT_ID = os.environ.get("MQTT_PUBLISHER_CLIENT_ID", "mqtt-publisher-sim").strip() or "mqtt-publisher-sim"
PUBLISH_ITEMS = publisher_items()


def build_payload() -> dict:
    ts = int(time.time() * 1000)
    values = []

    for index, item in enumerate(PUBLISH_ITEMS):
        offset = index * 5.0
        values.append(
            {
                "id": item["id"],
                "v": round(BASE_VALUE + offset + random.uniform(-JITTER, JITTER), 2),
                "t": ts,
            }
        )

    return {"values": values}


def connect() -> mqtt.Client:
    client = mqtt.Client(client_id=CLIENT_ID)

    if USERNAME or PASSWORD:
        client.username_pw_set(USERNAME, PASSWORD)

    while True:
        try:
            client.connect(HOST, PORT, 60)
            return client
        except Exception as exc:  # pragma: no cover - runtime retry path
            print(f"[mqtt-publisher] connect failed: {exc}", flush=True)
            time.sleep(3)


def main() -> None:
    client = connect()
    item_descriptions = ",".join(
        f"{item['section']}:{item['position']}={item['id']}" for item in PUBLISH_ITEMS
    )
    print(
        f"[mqtt-publisher] started host={HOST} port={PORT} topic={TOPIC} items={item_descriptions}",
        flush=True,
    )

    while True:
        payload = build_payload()
        message = json.dumps(payload, separators=(",", ":"))
        info = client.publish(TOPIC, message, qos=QOS)
        info.wait_for_publish()
        print(f"[mqtt-publisher] published {message}", flush=True)
        time.sleep(INTERVAL_SECONDS)


if __name__ == "__main__":
    main()
