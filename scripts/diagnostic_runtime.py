import json
import os
import socket
import time
import uuid
from typing import Any, Dict, Optional

import psycopg2
import requests
from kafka import KafkaConsumer, KafkaProducer
from pymongo import MongoClient


def now_ms() -> int:
    return int(time.time() * 1000)


def resolve_layer() -> str:
    return str(
        os.environ.get("DIAGNOSTIC_LAYER_NAME")
        or os.environ.get("COMPANY_NAME")
        or "Inkai"
    ).strip().lower()


def resolve_layer_db_name() -> str:
    configured_db_name = (
        os.environ.get("LEGACY_LAYER_DB_NAME")
        or os.environ.get("LAYER_DB_NAME")
    )
    if configured_db_name:
        return str(configured_db_name).strip().lower()

    resolved_layer = resolve_layer()
    if resolved_layer == "std":
        return str(os.environ.get("PG_DB", "demo")).strip().lower()
    return resolved_layer


def kafka_host() -> str:
    return os.environ.get("Kafka_Host_DP") or os.environ.get("Kafka_Host") or "broker:29092"


def kafka_producer() -> KafkaProducer:
    return KafkaProducer(
        bootstrap_servers=kafka_host(),
        value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        linger_ms=10,
    )


def build_payload(
    *,
    source: str,
    topic: str,
    category: str,
    state: str,
    message: str,
    log_type: str,
    user: str = "system",
    extra: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    priority_map = {"Alarm": 1, "Warning": 2, "Notification": 3, "Info": 3}
    payload: Dict[str, Any] = {
        "LOG_TYPE": log_type,
        "error_message": message,
        "layer": resolve_layer(),
        "priority": priority_map.get(log_type, 3),
        "source": source,
        "category": category,
        "state": state,
        "is_read": False,
        "id": str(uuid.uuid4()),
        "time": now_ms(),
        "user": user,
    }
    if extra:
        payload.update(extra)
    return payload


def send_payload(topic: str, payload: Dict[str, Any]) -> None:
    producer = kafka_producer()
    try:
        producer.send(topic, value=payload)
        producer.flush()
    finally:
        producer.close()


def socket_check(host: str, port: int, timeout_seconds: int = 5) -> bool:
    with socket.create_connection((host, port), timeout=timeout_seconds):
        return True


def http_check(url: str, timeout_seconds: int = 5) -> bool:
    response = requests.get(url, timeout=timeout_seconds)
    response.raise_for_status()
    return True


def pg_check() -> bool:
    conn = psycopg2.connect(
        host=os.environ.get("PG_HOST", "postgres"),
        port=os.environ.get("PG_PORT", "5432"),
        database=os.environ.get("PG_DB", "demo"),
        user=os.environ.get("PG_USER", "postgres"),
        password=os.environ.get("PG_PASS", "postgres"),
    )
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            return cur.fetchone() == (1,)
    finally:
        conn.close()


def mongo_client() -> MongoClient:
    return MongoClient(os.environ.get("Mongo_Client", "mongodb://admin:admin@mongo-dev:27017/"))


def write_runtime_document(topic: str, payload: Dict[str, Any]) -> None:
    collection_name = {
        "notifications": os.environ.get("Mongo_Notifications_db", "notifications"),
        "warnings": os.environ.get("Mongo_Warnings_db", "warnings"),
        "logs": os.environ.get("Mongo_Logs_db", "logs"),
    }[topic]

    client = mongo_client()
    try:
        db = client[resolve_layer()]
        collection = db[collection_name]

        if topic in {"notifications", "warnings"}:
            collection.create_index([("source", 1)], unique=True)
            collection.update_one(
                {"source": payload.get("source")},
                {"$set": payload},
                upsert=True,
            )
        else:
            collection.create_index([("time", 1)])
            collection.insert_one(payload)
    finally:
        client.close()


def write_pg_event(payload: Dict[str, Any]) -> None:
    conn = psycopg2.connect(
        host=os.environ.get("PG_HOST", "postgres"),
        port=os.environ.get("PG_PORT", "5432"),
        database=resolve_layer_db_name(),
        user=os.environ.get("PG_USER", "postgres"),
        password=os.environ.get("PG_PASS", "postgres"),
    )
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO event_event (
                    log_type, error_message, short_name, interval, layer, priority,
                    source, measurement, tag_value, tag_quality, gap, gap_type, asset,
                    category, state, is_read, id, time
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
                """,
                (
                    payload.get("LOG_TYPE"),
                    payload.get("error_message"),
                    payload.get("short_name"),
                    payload.get("interval"),
                    payload.get("layer"),
                    payload.get("priority"),
                    payload.get("source"),
                    payload.get("measurement"),
                    payload.get("tag_value"),
                    payload.get("tag_quality"),
                    payload.get("gap"),
                    payload.get("gap_type"),
                    payload.get("asset"),
                    payload.get("category"),
                    payload.get("state"),
                    payload.get("is_read"),
                    payload.get("id"),
                    payload.get("time"),
                ),
            )
        conn.commit()
    finally:
        conn.close()


def write_pg_log(payload: Dict[str, Any]) -> None:
    conn = psycopg2.connect(
        host=os.environ.get("PG_HOST", "postgres"),
        port=os.environ.get("PG_PORT", "5432"),
        database=resolve_layer_db_name(),
        user=os.environ.get("PG_USER", "postgres"),
        password=os.environ.get("PG_PASS", "postgres"),
    )
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO logs_logs (
                    log_type, error_message, layer, priority, source, category,
                    state, "user", is_read, id, time
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING
                """,
                (
                    payload.get("LOG_TYPE"),
                    payload.get("error_message"),
                    payload.get("layer"),
                    payload.get("priority"),
                    payload.get("source"),
                    payload.get("category"),
                    payload.get("state"),
                    payload.get("user"),
                    payload.get("is_read"),
                    payload.get("id"),
                    payload.get("time"),
                ),
            )
        conn.commit()
    finally:
        conn.close()


def kafka_consumer(topic: str) -> KafkaConsumer:
    return KafkaConsumer(
        topic,
        bootstrap_servers=kafka_host(),
        auto_offset_reset="latest",
        enable_auto_commit=True,
        group_id=f"diagnostic-{topic}-consumer",
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
    )
def run_consumer(topic: str) -> None:
    consumer = kafka_consumer(topic)
    for message in consumer:
        payload = message.value
        write_runtime_document(topic, payload)
        if topic == "logs":
            write_pg_log(payload)
        else:
            write_pg_event(payload)


def run_probe(name: str, fn, *, topic: str, category: str, ok_message: str, fail_message: str, ok_type: str = "Notification", fail_type: str = "Alarm") -> None:
    try:
        is_ok = fn()
        state = "Running" if is_ok else "Stopped"
        payload = build_payload(
            source=name,
            topic=topic,
            category=category,
            state=state,
            message=ok_message if is_ok else fail_message,
            log_type=ok_type if is_ok else fail_type,
        )
    except Exception as exc:
        payload = build_payload(
            source=name,
            topic=topic,
            category=category,
            state="Stopped",
            message=f"{fail_message}: {exc}",
            log_type=fail_type,
        )
    send_payload(topic, payload)
