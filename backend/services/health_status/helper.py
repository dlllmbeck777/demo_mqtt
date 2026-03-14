from kafka import KafkaProducer
import os
import json
import time
import uuid
import logging


logger = logging.getLogger(__name__)
producer = None
producer_failed = False


def resolve_layer_name(layer_name=None):
    value = (
        layer_name
        or os.environ.get("DIAGNOSTIC_LAYER_NAME")
        or os.environ.get("COMPANY_NAME")
        or "STD"
    )
    return str(value).strip().lower()


def get_producer():
    global producer, producer_failed

    if producer is not None:
        return producer
    if producer_failed:
        return None

    host = os.environ.get("Kafka_Host_DP")
    if not host:
        return None

    try:
        producer = KafkaProducer(
            bootstrap_servers=host,
            value_serializer=lambda v: json.dumps(v).encode("ascii"),
        )
    except Exception:
        producer_failed = True
        logger.exception("Kafka producer initialization failed")
        return None

    return producer


def send_alarm(
    source,
    alarms_type="Notification",
    error_message="There is No Problem",
    layer_name=None,
    category="system_health",
    state="Running",
    timestamp=int(time.time() * 1000),
    is_read=False,
    topic="notifications",
):
    id = str(uuid.uuid4())
    priority = {"Alarm": 1, "Warning": 2, "Notification": 3}
    data = {
        "LOG_TYPE": alarms_type,
        "error_message": error_message,
        "layer": resolve_layer_name(layer_name),
        "priority": priority.get(alarms_type),
        "source": source,
        "category": category,
        "state": state,
        "is_read": is_read,
        "id": id,
        "time": timestamp,
    }
    send_kafka(topic, data)


def send_kafka(topic, data):
    kafka_producer = get_producer()
    if kafka_producer is None:
        return

    kafka_producer.send(topic, value=data)
    kafka_producer.flush()


def get_health_status_messages(status_type, culture):
    return f"TYPE.HEALTH_STATUS.{status_type}"


def get_warning_messages(label_id, culture):  # data retrieval
    return f"TYPE.WARNINGS.DATA.RETRIEVAL.{label_id}"
