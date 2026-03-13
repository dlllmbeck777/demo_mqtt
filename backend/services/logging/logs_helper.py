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


def send_kafka(topic, data):
    producer.send(topic, value=data)
    producer.flush()


def send_logs(
    source,
    alarms_type="Notification",
    error_message="There is No Problem",
    layer_name="inkai",
    category="system_health",
    state="Running",
    timestamp=int(time.time() * 1000),
    is_read=False,
    topic="notifications",
    user="Anonymous",
):
    id = str(uuid.uuid4())
    priority = {
        "Alarm": 1,
        "Warning": 2,
        "Notification": 3,
        "Info": 3,
    }
    data = {
        "LOG_TYPE": alarms_type,
        "error_message": error_message,
        "layer": layer_name,
        "priority": priority.get(alarms_type),
        "source": source,
        "category": category,
        "state": state,
        "user": user,
        "is_read": is_read,
        "id": id,
        "time": timestamp,
    }
    send_kafka(topic, data)
