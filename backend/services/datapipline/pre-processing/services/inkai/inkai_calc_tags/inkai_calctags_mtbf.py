import sys
from kafka import KafkaProducer
import json
from ast import literal_eval
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers="broker:29092",
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)

def calculate_mtbf(total_up_time, total_failures):
    mtbf = total_up_time / total_failures
    return mtbf

data = literal_eval(data)
data["calc_type"] = "mtbf"
data["value"] = calculate_mtbf(30 ,3)
producer.send('mtbf_result', value=data)
producer.flush()
