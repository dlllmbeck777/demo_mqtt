from kafka import KafkaProducer
import os
import json
import datetime
import time
import uuid

host = os.environ["Kafka_Host_DP"]
producer = KafkaProducer(
    bootstrap_servers=host,
    value_serializer=lambda v: json.dumps(v).encode("ascii"),
)


def resolve_layer_name(explicit_layer_name=None, layer=None):
    value = explicit_layer_name or layer or os.environ.get("DIAGNOSTIC_LAYER_NAME") or os.environ.get("COMPANY_NAME") or "STD"
    return str(value).strip().lower()


def send_alarm(
    source,
    measurement,
    layer,
    tag_value,
    tag_quality,
    time,
    gap,
    gap_type,
    asset,
    short_name,
    interval,
    alarms_type="Alarm",
    error_message="Value of Incoming Data is Out of Bounds",
    layer_name=None,
    category="alarms",
    state="low quality",
    timestamp = int(time.time() * 1000),
    is_read= False,
    topic = "out_of_alarms",

):  
    id = str(uuid.uuid4())
    priority = {"Alarm": 1, "Warning": 2, "Notification": 3}
    data = {
        "LOG_TYPE": alarms_type,
        "error_message": error_message,
        "layer": resolve_layer_name(layer_name, layer),
        "priority": priority.get(alarms_type),
        "short_name": short_name,
        "interval": interval,
        "source": source,
        "measurement": measurement,
        "tag_value": tag_value,
        "tag_quality": tag_quality,
        "time": time,
        "gap": gap,
        "gap_type": gap_type,
        "asset": asset,
        "category": category,
        "state": state,
        "is_read": is_read,
        "id": id,
        "time": timestamp
    }
    send_kafka(topic, data)

def send_kafka(topic,data):
    producer.send(topic, value=data)
    producer.flush()
