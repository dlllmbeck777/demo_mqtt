from kafka import KafkaConsumer, TopicPartition
import paho.mqtt.client as mqtt
from kafka import KafkaProducer
from ast import literal_eval
import pandas as pd
import datetime
import json
import os

host = os.environ.get('Kafka_Host_DP')
username = os.environ.get('MQTT_USERNAME')
password = os.environ.get('MQTT_PASSWORD')
topic = "iot-inkai-raw"
broker_address = os.environ.get('IP_ADRESS')

client = mqtt.Client()

client.username_pw_set(username, password)

client.connect(broker_address)
client.subscribe(topic)

i = 0


def on_message(client, userdata, msg):
    my_json = msg.payload.decode('utf8')
    incoming_data = json.loads(my_json)
    print(incoming_data)

client.on_message = on_message

client.loop_forever()
