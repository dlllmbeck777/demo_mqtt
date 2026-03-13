import sys
import json
import datetime
from ast import literal_eval
import requests
import math
import os
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers="broker:29092",
    value_serializer=lambda v: json.dumps(v).encode("ascii"),
)

base_url = os.environ["BACKEND_BASE_URL"]

url = base_url + "/api/v1/item-property/get/rpm/Horasan/"

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
                producer.send("inkai_vibration_data", value=data[i])
                producer.flush()
        data_list.append(data[i])
    return data_list


for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)
