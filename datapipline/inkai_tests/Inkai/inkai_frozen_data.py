from kafka import KafkaProducer
from kafka import KafkaConsumer, TopicPartition
import os
import pandas as pd
from ast import literal_eval
import json

host = os.environ.get("Kafka_Host_DP")
topic = "inkai-frozendata"

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

tag_name_dict = {}


def add_data(tag_name, tag_value):
    if tag_name not in tag_name_dict:
        tag_name_dict[tag_name] = []
    tag_name_dict[tag_name].append(tag_value)


def check_repeated_values(tag_name):
    values = tag_name_dict[tag_name][-3:]
    torfalse = all(x == values[0] for x in values)
    if len(values) >= 3 and torfalse:
        print(
            f"{tag_name}: {values[0]} The same value data came for the 3rd time in a row!"
        )
        if data["payload"]["insert"][0]["vqt"][0]["q"] == 192:
            data["payload"]["insert"][0]["vqt"][0]["q"] -= 125

    if len(values) >= 3 and values[-1] != values[-2]:
        tag_name_dict[tag_name].clear()


for message in consumer:
    df = message.value
    data = literal_eval(df.decode("utf8"))
    add_data(
        data["payload"]["insert"][0]["fqn"],
        data["payload"]["insert"][0]["vqt"][0]["v"],
    )
    check_repeated_values(data["payload"]["insert"][0]["fqn"])
    data["step-status"] = "frozen-data"
    producer.send("inkai-scaling-data", value=data)
    producer.flush()
