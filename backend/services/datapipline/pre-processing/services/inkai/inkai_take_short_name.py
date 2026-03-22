import sys
import json
import datetime
from ast import literal_eval
import time
import os
import requests

base_url = os.environ.get("BACKEND_BASE_URL", "http://localhost:8000")
layer_name = str(
    os.environ.get("LEGACY_LAYER_NAME")
    or os.environ.get("DIAGNOSTIC_LAYER_NAME")
    or os.environ.get("COMPANY_NAME")
    or "STD"
).strip()


def get_tag_data(base_url):
    url = base_url + f"/api/v1/tags/get/shortname/{layer_name}/"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Unable to fetch data from the API")


tag_data = get_tag_data(base_url)


def process_data(data, tag_data):
    sent_data_list = []
    data = literal_eval(data)
    for item in data:
        for key, value in tag_data.items():
            if item["payload"]["insert"][0]["fqn"] == key:
                item["payload"]["insert"][0]["short_name"] = value

    return data


for line in sys.stdin:
    processed_data = process_data(line.strip(), tag_data)
    print(processed_data)
