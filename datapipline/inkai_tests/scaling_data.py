from kafka import KafkaProducer
import json
from kafka import KafkaConsumer, TopicPartition
from pprint import pprint
import os
import pandas as pd
from ast import literal_eval
import json

host = os.environ.get("Kafka_Host_DP")
topic = "scaling_data"
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


def scale_data(data):
    scaled_data = float(data["payload"]["insert"][0]["vqts"][0]["v"])
    data["payload"]["insert"][0]["vqts"][0]["v"] = scaled_data * 1
    return data["payload"]["insert"][0]["vqts"][0]["v"]


for message in consumer:
    df = message.value
    data = literal_eval(df.decode("utf8"))
    df2 = dict(data)
    print(scale_data(data))

    producer.send("uom_conversion", value=data)
    producer.flush()
