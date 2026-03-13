import sys
from kafka import KafkaConsumer, TopicPartition
from kafka import KafkaProducer
import json
import datetime
from ast import literal_eval
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers="broker:29092",
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)

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

i = 0
def process_data(data):
    data = literal_eval(data)
    for i in range(len(data)):
        add_data(
            data[i]["payload"]["insert"][0]["fqn"],
            data[i]["payload"]["insert"][0]["vqt"][0]["v"],
        )
        check_repeated_values(data[i]["payload"]["insert"][0]["fqn"])
        data[i]["step-status"] = "frozen-data"
    producer.send('scaling-data2', value=data)
    producer.flush()
    return data

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)

    