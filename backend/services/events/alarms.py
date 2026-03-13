from kafka import KafkaProducer
import json
from kafka import KafkaConsumer, TopicPartition
from pprint import pprint
import os
import pandas as pd
from ast import literal_eval
import json
import uuid
from services.health_status.helper import send_alarm

host = os.environ.get("Kafka_Host")
topics = ["backfill_data", "live_data"]
bootstrap_servers = host
consumer = KafkaConsumer(
    *topics, bootstrap_servers=bootstrap_servers, auto_offset_reset="latest"
)
consumer.poll()


def checkEvent(message):
    data = json.loads(message.value.decode("utf-8"))
    key = uuid.uuid4().hex
    key = key.encode("utf-8")
    if data.get("quality") == 66:
        data["message_type"] = "out of the range max value"

    if data.get("quality") == 65:
        data["message_type"] = "out of the range min value"

    if data.get("quality") == 67:
        data["message_type"] = "frozen_data"

    return data


for message in consumer:
    data = checkEvent(message)
    send_alarm("Alarms", data, "DATA", error_message=data.get("message_type"))
