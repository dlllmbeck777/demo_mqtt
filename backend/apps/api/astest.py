from kafka import KafkaConsumer, TopicPartition
import os
import pandas as pd
from ast import literal_eval
import json

host = os.environ.get("Kafka_Host_DP")
# Kafka ayarları
topic = "notifications"
try:
    consumer = KafkaConsumer(
        group_id=topic,
        bootstrap_servers=host,
        enable_auto_commit=False,
        auto_offset_reset="earliest",
    )

    tp = TopicPartition(topic, 0)
    consumer.assign([tp])
    consumer.poll()
    consumer.seek_to_end()
except:
    pass

for message in consumer:
    df = message.value
    if df:
        print(df)
    else:
        print("Mesaj Yok")
