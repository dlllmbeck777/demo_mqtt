from kafka import KafkaProducer
import json
from kafka import KafkaConsumer, TopicPartition
from pprint import pprint
import os
import pandas as pd
from ast import literal_eval
import json
import datetime

host = os.environ.get("Kafka_Host_DP")
topic = "raw-data"
consumer = KafkaConsumer(
    group_id=topic,
    bootstrap_servers=host,
    enable_auto_commit=False,
    auto_offset_reset="earliest",
)
producer = KafkaProducer(
    bootstrap_servers=host,
    value_serializer=lambda v: json.dumps(v).encode("ascii"),
)
tp = TopicPartition(topic, 0)
consumer.assign([tp])
consumer.poll()
consumer.seek_to_end()


def convert_fqn_format(data):
    fqn_format = {
        "header": data["header"],
        "payload": data["payload"],
        "DiffInHours": data["DiffInHours"],
        "step-status": data["step-status"],
    }
    return fqn_format


def add_veriable(data):
    data["date"] = data["date"]
    data["quality"] = 192
    data["layer"] = "KNOC"
    data["version"] = 0.1
    data["step-status"] = "formatting"
    data["message_type"] = "raw-data"
    try:
        data["date"] = datetime.datetime.strptime(data["date"], "%Y-%m-%d %H:%M:%S.%f")
    except:
        pass
    data["createdTime"] = datetime.datetime.now()
    return data


def time_difference(time, present):
    if type(time) == str:
        print(time)
    else:
        difference = present - time
        seconds = difference.total_seconds()
        hours_dif = seconds / (60 * 60)
        return hours_dif


def message_type_specify(message_type, time_diff):
    if time_diff > 96:
        message_type = "backfill_data"
    else:
        message_type = "live_data"
    return message_type


for message in consumer:
    try:
        df = message.value
        data = literal_eval(df.decode("utf-8"))
        add_veriable(data)
        data["DiffInHours"] = time_difference(data["date"], data["createdTime"])
        data["message_type"] = message_type_specify(
            data["message_type"], time_difference(data["date"], data["createdTime"])
        )
        data["date"] = str(data["date"])
        data["createdTime"] = str(data["createdTime"])

        data["header"] = {
            "version": data["version"],
            "created_by": data["created_by"],
            "createdTime": data["createdTime"],
            "message_Type": data["message_type"],
            "layer": data["layer"],
            "asset": data["completion"],
        }
        data["payload"] = {
            "insert": [
                {
                    "fqn": data["tag_name"],
                    "vqts": [
                        {
                            "v": data["tag_value"],
                            "q": data["quality"],
                            "t": data["date"],
                            "s": data["uom"],
                        }
                    ],
                }
            ]
        }
        data = convert_fqn_format(data)
        print(data)
        producer.send("backorlivee", value=data)
        producer.flush()
    except:
        print("There is a problem with the incoming data :" + data)


# {"completion": "203", "created_by": "Электон 18.25", "date": "2024-01-26 08:00:03.236", "tag_name": "Ток ПЭД (В)", "uom": " А", "tag_value": 0.0}
# {"completion": "120", "created_by": "Регион", "date": "2020-01-27 22:20:45.003213", "tag_name": "Частота турб вращения", "uom": " Гц", "tag_value": 10}
