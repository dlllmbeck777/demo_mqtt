import sys
from kafka import KafkaProducer
import json
from ast import literal_eval
from kafka import KafkaProducer
from datetime import datetime

producer = KafkaProducer(
    bootstrap_servers="broker:29092",
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)

def calculate_pod(calibration_date ,pause_start, pause_end):
    current_date = datetime.now()
    total_lifetime = (current_date - calibration_date).total_seconds()
    first_pause_duration = (pause_end - pause_start).total_seconds()
    working_time = total_lifetime - first_pause_duration
    pod = (working_time / total_lifetime) * 100
    print(f"The machine has run for %{percentage_working:.2f} throughout its lifetime.")
    return pod

data = literal_eval(data)
data["calc_type"] = "pod"
data["value"] = calculate_pod(datetime(2023, 1, 1),datetime(2023, 5, 1), datetime(2023, 6, 1))
producer.send('pod_result', value=data)
producer.flush()

