import sys
from kafka import KafkaProducer
import json
from ast import literal_eval
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers="broker:29092",
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)

def calculate_mtbm(maintenance_times, downtime_between_failures):
    total_maintenance_time = sum(maintenance_times)
    total_downtime = sum(downtime_between_failures)
    number_of_failures = len(downtime_between_failures)
    mtbm = total_downtime / number_of_failures
    return mtbm

data = literal_eval(data)
data["calc_type"] = "mtbm"
data["value"] = calculate_mtbm([100, 150, 200, 80, 120] , [500, 300, 600, 400, 200])
producer.send('mtbm_result', value=data)
producer.flush()