import sys
import json
import datetime
from ast import literal_eval
from kafka import KafkaConsumer, TopicPartition, KafkaProducer

tag_name_dict = {}


def add_data(tag_name, tag_value):
    if tag_name not in tag_name_dict:
        tag_name_dict[tag_name] = []
    tag_name_dict[tag_name].append(tag_value)


def check_repeated_values(tag_name):
    values = tag_name_dict[tag_name][-3:]
    are_values_same = all(x == values[0] for x in values)
    repeated_threshold = 3

    if len(values) >= repeated_threshold and are_values_same:
        print(f"{tag_name}: {values[0]} The same value data came for the 3rd time in a row!")
        if data["payload"]["insert"][0]["vqt"][0]["q"] == 192:
            data["payload"]["insert"][0]["vqt"][0]["q"] -= 125

    if len(values) >= repeated_threshold and values[-1] != values[-2]:
        tag_name_dict[tag_name].clear()


def process_data(data):
    data = literal_eval(data)
    for index in range(len(data)):
        add_data(
            data[index]["payload"]["insert"][0]["fqn"],
            data[index]["payload"]["insert"][0]["vqt"][0]["v"],
        )
        check_repeated_values(data[index]["payload"]["insert"][0]["fqn"])
        data[index]["step-status"] = "frozen-data"
    return data


for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)