import sys
import json
import datetime
import os

LAYER_NAME = str(
    os.environ.get("LEGACY_LAYER_NAME")
    or os.environ.get("DIAGNOSTIC_LAYER_NAME")
    or os.environ.get("COMPANY_NAME")
    or "STD"
).strip()


def convert_fqn_format(data):
    fqn_format = {
        "header": data["header"],
        "payload": data["payload"],
        "step-status": data["step-status"],
    }
    return fqn_format


def add_variable(data):
    id_split = data["id"].split(".")
    data_timestamp = data["t"]
    data["date"] = datetime.datetime.fromtimestamp(data_timestamp / 1000).strftime(
        "%Y-%m-%d %H:%M:%S.%f"
    )
    data["q"] = 192
    data["layer"] = LAYER_NAME
    data["version"] = 1
    data["step-status"] = "fqn-format"
    data["createdTime"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
    data["asset"] = id_split[2]
    data["tag_name"] = data["id"].split('.')[-1]
    data["createdTime"] = str(datetime.datetime.now())
    del data["id"]
    return data


def process_data(data):
    incoming_data = json.loads(data)
    data_list = []
    for item in incoming_data["values"]:
        item_data = add_variable(item)
        item_data["date"] = str(item_data["date"])
        item_data["createdTime"] = str(item_data["createdTime"])
        item_data["header"] = {
            "version": item_data["version"],
            "createdTime": item_data["createdTime"],
            "layer": item_data["layer"],
            "asset": item_data["asset"],
        }
        item_data["payload"] = {
            "insert": [
                {
                    "fqn": item_data["tag_name"],
                    "vqt": [
                        {
                            "v": item_data["v"],
                            "q": item_data["q"],
                            "t": item_data["t"],
                        }
                    ],
                }
            ]
        }
        fqn_data = convert_fqn_format(item_data)
        data_list.append(fqn_data)
    return data_list


for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)
