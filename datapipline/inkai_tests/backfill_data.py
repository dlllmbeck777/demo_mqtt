from kafka import KafkaProducer
import json
from kafka import KafkaConsumer, TopicPartition
from pprint import pprint
import os
import pandas as pd
from ast import literal_eval
import json

host = os.environ.get("Kafka_Host_DP")
topic = "backorlivee"
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


def checkBackData(data, time_difference):
    if time_difference > 96:
        print("Incoming data is backfill data")
        data["header"]["message_type"] = "backfill_data"
        del data["DiffInHours"]
        return data
    else:
        print("Incoming data is live data")
        data["header"]["message_type"] = "live_data"
        del data["DiffInHours"]
        return data


for message in consumer:
    df = message.value
    data = literal_eval(df.decode("utf-8"))
    print(data)
    data["step-status"] = "backfill_data"
    checkBackData(data, data["DiffInHours"])
    producer.send("frozen_data", value=data)
    producer.flush()
