import sys
import json
import datetime
from ast import literal_eval
import requests
import math
import os
from kafka import KafkaProducer

layer_name = str(
    os.environ.get("LEGACY_LAYER_NAME")
    or os.environ.get("DIAGNOSTIC_LAYER_NAME")
    or os.environ.get("COMPANY_NAME")
    or "STD"
).strip()
layer_slug = layer_name.lower()
rpm_topic = os.environ.get("LEGACY_RPM_TOPIC", f"{layer_slug}_vibration_data")

producer = KafkaProducer(
    bootstrap_servers=os.environ.get(
        "KAFKA_BOOTSTRAP_SERVERS",
        os.environ.get("Kafka_Host_DP", os.environ.get("Kafka_Host", "broker:29092")),
    ),
    value_serializer=lambda v: json.dumps(v).encode("ascii"),
)

base_url = os.environ.get("BACKEND_BASE_URL", "http://localhost:8000")

url = base_url + f"/api/v1/item-property/get/rpm/{layer_name}/"

data_list = []


def process_data(data):
    data = literal_eval(data)
    response = requests.get(url)
    rpm_data = response.json()
    for i in range(len(data)):
        asset_name = data[i]["asset"]
        for rpm_item in rpm_data:
            if asset_name in rpm_item:
                RPM = rpm_item[asset_name]
                data[i]["RPM"] = RPM
                producer.send(rpm_topic, value=data[i])
                producer.flush()
        data_list.append(data[i])
    return data_list


for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)
