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
topic = os.environ.get('MQTT_TOPIC')
broker_address = os.environ.get('IP_ADRESS')

producer = KafkaProducer(
    bootstrap_servers=host,
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)


def convert_fqn_format(data):
    fqn_format = {
        'header': data['header'],
        'payload': data['payload'],
        'DiffInHours': data['DiffInHours'],
        'step-status': data['step-status'],
    }
    return fqn_format


def add_veriable(data, data_timestamp):
    id_split = data['id'].split('.')
    data['date'] = datetime.datetime.fromtimestamp(data_timestamp / 1000).strftime(
        '%Y-%m-%d %H:%M:%S.%f'
    )
    data['q'] = 192
    data['layer'] = 'Inkai'
    data['version'] = 1
    data['step-status'] = 'formatting'
    data['message_type'] = 'raw-data'
    data['createdTime'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
    data['asset'] = id_split[2]
    data['tag_name'] = data['id']
    data['createdTime'] = str(datetime.datetime.now())
    del data['id']
    return data


def time_difference(time, present):
    time = datetime.datetime.strptime(time, '%Y-%m-%d %H:%M:%S.%f')
    present = datetime.datetime.strptime(present, '%Y-%m-%d %H:%M:%S.%f')
    difference = present - time
    seconds = difference.total_seconds()
    hours_dif = seconds / (60 * 60)
    return hours_dif


def message_type_specify(message_type, time_diff):
    if time_diff > 96:
        message_type = 'inkai-backfill-data'
    else:
        message_type = 'inkai-live-data'
    return message_type


client = mqtt.Client()

client.username_pw_set(username, password)

client.connect(broker_address)
client.subscribe(topic)

i = 0


def on_message(client, userdata, msg):
    my_json = msg.payload.decode('utf8')
    incoming_data = json.loads(my_json)
    # print(incoming_data)
    for i in range(len(incoming_data['values'])):
        i += 1
        add_veriable(incoming_data['values'][i - 1], incoming_data['timestamp'])
        data = incoming_data['values'][i - 1]
        data['DiffInHours'] = time_difference(data['date'], data['createdTime'])
        data['message_type'] = message_type_specify(
            data['message_type'], time_difference(data['date'], data['createdTime'])
        )
        data['date'] = str(data['date'])
        data['createdTime'] = str(data['createdTime'])
        data['header'] = {
            'version': data['version'],
            'createdTime': data['createdTime'],
            'message_Type': data['message_type'],
            'layer': data['layer'],
            'asset': data['asset'],
        }
        data['payload'] = {
            'insert': [
                {
                    'fqn': data['tag_name'],
                    'vqt': [
                        {
                            'v': data['v'],
                            'q': data['q'],
                            't': data['t'],
                        }
                    ],
                }
            ]
        }
        data = convert_fqn_format(data)
        producer.send('inkai-frozendata', value=data)


client.on_message = on_message

client.loop_forever()
