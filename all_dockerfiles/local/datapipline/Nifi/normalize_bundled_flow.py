#!/usr/bin/env python3
import gzip
import json
import os
from pathlib import Path
import xml.etree.ElementTree as ET


FLOW_DIR = Path(os.environ.get("NIFI_BUNDLED_FLOW_DIR", "/opt/nifi/bootstrap-flow"))
BROKER_URI = os.environ.get("NIFI_MQTT_BROKER_URI", "tcp://mosquitto:1883").strip() or "tcp://mosquitto:1883"
TOPIC = os.environ.get("NIFI_MQTT_TOPIC", os.environ.get("MQTT_TOPIC", "iot-inkai-raw")).strip() or "iot-inkai-raw"
USERNAME = os.environ.get("NIFI_MQTT_USERNAME", "").strip()
PASSWORD = os.environ.get("NIFI_MQTT_PASSWORD", "").strip()
PROCESSOR_TYPE = "org.apache.nifi.processors.mqtt.ConsumeMQTT"


def write_gzip_text(path: Path, text: str) -> None:
    path.write_bytes(gzip.compress(text.encode("utf-8")))


def set_or_remove_xml_property(processor: ET.Element, key: str, value: str) -> bool:
    for prop in list(processor.findall("property")):
        if prop.findtext("name") == key:
            if value:
                value_node = prop.find("value")
                if value_node is None:
                    value_node = ET.SubElement(prop, "value")
                if value_node.text != value:
                    value_node.text = value
                    return True
                return False
            processor.remove(prop)
            return True

    if not value:
        return False

    prop = ET.SubElement(processor, "property")
    name_node = ET.SubElement(prop, "name")
    name_node.text = key
    value_node = ET.SubElement(prop, "value")
    value_node.text = value
    return True


def normalize_xml(path: Path) -> bool:
    if not path.exists():
        return False

    xml_text = gzip.decompress(path.read_bytes()).decode("utf-8", errors="ignore")
    root = ET.fromstring(xml_text)
    changed = False

    for processor in root.iter("processor"):
        if processor.findtext("name") != "ConsumeMQTT":
            continue

        changed |= set_or_remove_xml_property(processor, "Broker URI", BROKER_URI)
        changed |= set_or_remove_xml_property(processor, "Topic Filter", TOPIC)
        changed |= set_or_remove_xml_property(processor, "Username", USERNAME)
        changed |= set_or_remove_xml_property(processor, "Password", PASSWORD)

    if changed:
        write_gzip_text(path, ET.tostring(root, encoding="unicode"))

    return changed


def update_json_properties(properties: dict) -> bool:
    changed = False

    if properties.get("Broker URI") != BROKER_URI:
        properties["Broker URI"] = BROKER_URI
        changed = True

    if properties.get("Topic Filter") != TOPIC:
        properties["Topic Filter"] = TOPIC
        changed = True

    if USERNAME:
        if properties.get("Username") != USERNAME:
            properties["Username"] = USERNAME
            changed = True
    elif "Username" in properties:
        properties.pop("Username", None)
        changed = True

    if PASSWORD:
        if properties.get("Password") != PASSWORD:
            properties["Password"] = PASSWORD
            changed = True
    elif "Password" in properties:
        properties.pop("Password", None)
        changed = True

    return changed


def walk_json(node) -> bool:
    changed = False

    if isinstance(node, dict):
        if node.get("name") == "ConsumeMQTT" and node.get("type") == PROCESSOR_TYPE:
            props = None
            if isinstance(node.get("config"), dict) and isinstance(node["config"].get("properties"), dict):
                props = node["config"]["properties"]
            elif isinstance(node.get("properties"), dict):
                props = node["properties"]

            if props is not None:
                changed |= update_json_properties(props)

        for value in node.values():
            changed |= walk_json(value)
    elif isinstance(node, list):
        for value in node:
            changed |= walk_json(value)

    return changed


def normalize_json(path: Path) -> bool:
    if not path.exists():
        return False

    data = json.loads(gzip.decompress(path.read_bytes()).decode("utf-8", errors="ignore"))
    changed = walk_json(data)

    if changed:
        write_gzip_text(path, json.dumps(data, separators=(",", ":")))

    return changed


def main() -> None:
    xml_changed = normalize_xml(FLOW_DIR / "flow.xml.gz")
    json_changed = normalize_json(FLOW_DIR / "flow.json.gz")
    print(
        f"[nifi-flow] normalized mqtt config broker_uri={BROKER_URI} topic={TOPIC} "
        f"username={'set' if USERNAME else 'empty'} xml_changed={xml_changed} json_changed={json_changed}",
        flush=True,
    )


if __name__ == "__main__":
    main()
