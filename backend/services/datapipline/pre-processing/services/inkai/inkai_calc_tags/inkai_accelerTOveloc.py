import sys
import json
import datetime
from ast import literal_eval
import requests
import math
import os
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers="broker:29092",
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)

def acceleration_to_velocity(tag_value, RPM, g_to_m_s2):
    frequency = float(RPM / 60)
    tag_value_m_s2 = tag_value * g_to_m_s2
    velocity = tag_value_m_s2 / (2 * math.pi * frequency)
    return velocity
    
data_list = []
def process_data(data):
    data = literal_eval(data)
    for i in range(len(data)):
        asset_name = data[i]["asset"]
        RPM = data[i]["RPM"]
        data[i]["measurement"] += "_vel" 
        data[i]["tag_value"] = 1000 * acceleration_to_velocity(data[i]["tag_value"], RPM, 9.81)
        data_list.append(data[i])
        producer.send("inkai_velocity_data", value=data[i])
        producer.flush()
    return data_list

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)