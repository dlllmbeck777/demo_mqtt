import sys
from kafka import KafkaConsumer, TopicPartition
from kafka import KafkaProducer
import json
import datetime
from ast import literal_eval

def scale_data(data):
    scaled_data = float(data["payload"]["insert"][0]["vqt"][0]["v"])
    data["payload"]["insert"][0]["vqt"][0]["v"] = scaled_data * 1
    return data["payload"]["insert"][0]["vqt"][0]["v"]


producer = KafkaProducer(
    bootstrap_servers="broker:29092",
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)
i = 0
def process_data(data):
    data = literal_eval(data)
    for i in range(len(data)):
        scale_data(data[i])
        data[i]["step-status"] = "scaling-data"
    return data

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)

    