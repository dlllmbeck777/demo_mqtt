import sys
from kafka import KafkaConsumer, TopicPartition
from kafka import KafkaProducer
import json
import datetime
from ast import literal_eval

producer = KafkaProducer(
    bootstrap_servers="broker:29092",
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)

def convert_fqn_format(data):
    fqn_format = {
        'header': data['header'],
        'payload': data['payload'],
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
    data['step-status'] = 'fqn-format'
    data['createdTime'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
    data['asset'] = id_split[2]
    data['tag_name'] = data['id']
    data['createdTime'] = str(datetime.datetime.now())
    del data['id']
    return data


i = 0
data_list = []
def process_data(data):
    df = data
    incoming_data = json.loads(df)
    for i in range(len(incoming_data['values'])):
        i += 1
        add_veriable(incoming_data['values'][i - 1], incoming_data['timestamp'])
        data = incoming_data['values'][i - 1]
        data['date'] = str(data['date'])
        data['createdTime'] = str(data['createdTime'])
        data['header'] = {
            'version': data['version'],
            'createdTime': data['createdTime'],
            'layer': data['layer'],
            'asset': "NULL",
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
        data_list.append(data)
    producer.send('frozen-data4', value=data_list)
    producer.flush()
    return data_list

for line in sys.stdin:
    processed_data = process_data(line.strip())

    