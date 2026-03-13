import sys
from kafka import KafkaProducer
import json
from ast import literal_eval
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers="broker:29092",
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)

def calculate_mttr(total_uptime, total_downtime, num_repairs):
    total_time = total_uptime + total_downtime

    mean_repair_time = total_downtime / num_repairs if num_repairs > 0 else 0

    mttr = mean_repair_time
    return mttr

total_uptime = 1000  # Toplam çalışma süresi (saat)
total_downtime = 50  # Toplam arıza süresi (saat)
num_repairs = 5      # Toplam tamir sayısı

data = literal_eval(data)
data["calc_type"] = "mtrr"
data["value"] = calculate_mttr(total_uptime, total_downtime, num_repairs)
producer.send('mtrr_result', value=data)
producer.flush()