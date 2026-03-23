import json
import os
import random
import time
from typing import List

import paho.mqtt.client as mqtt


def env_float(name: str, default: float) -> float:
    value = os.environ.get(name, "").strip()
    return float(value) if value else default


def env_int(name: str, default: int) -> int:
    value = os.environ.get(name, "").strip()
    return int(value) if value else default


def tag_ids() -> List[str]:
    raw = os.environ.get(
        "MQTT_PUBLISHER_TAG_IDS",
        "plant.horasan.125.THC_2_BP1_CURRENT,plant.horasan.125.THC_2_BP2_CURRENT",
    )
    tags = [item.strip() for item in raw.split(",") if item.strip()]
    if not tags:
        raise RuntimeError("MQTT_PUBLISHER_TAG_IDS is empty")
    return tags


HOST = os.environ.get("MQTT_PUBLISHER_HOST", "mosquitto").strip() or "mosquitto"
PORT = env_int("MQTT_PUBLISHER_PORT", 1883)
TOPIC = os.environ.get("MQTT_PUBLISHER_TOPIC", "iot-horasan-raw").strip() or "iot-horasan-raw"
INTERVAL_SECONDS = env_float("MQTT_PUBLISHER_INTERVAL_SECONDS", 5.0)
BASE_VALUE = env_float("MQTT_PUBLISHER_BASE_VALUE", 320.0)
JITTER = env_float("MQTT_PUBLISHER_JITTER", 10.0)
QOS = env_int("MQTT_PUBLISHER_QOS", 0)
USERNAME = os.environ.get("MQTT_PUBLISHER_USERNAME", "").strip()
PASSWORD = os.environ.get("MQTT_PUBLISHER_PASSWORD", "").strip()
CLIENT_ID = os.environ.get("MQTT_PUBLISHER_CLIENT_ID", "mqtt-publisher-sim").strip() or "mqtt-publisher-sim"
TAG_IDS = tag_ids()


def build_payload() -> dict:
    ts = int(time.time() * 1000)
    values = []

    for index, tag_id in enumerate(TAG_IDS):
        offset = index * 5.0
        values.append(
            {
                "id": tag_id,
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
    print(
        f"[mqtt-publisher] started host={HOST} port={PORT} topic={TOPIC} tags={','.join(TAG_IDS)}",
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
