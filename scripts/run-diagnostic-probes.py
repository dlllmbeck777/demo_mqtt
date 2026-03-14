import os
import time

from diagnostic_runtime import http_check, pg_check, run_probe, socket_check


def app_api_url() -> str:
    explicit = os.environ.get("DIAGNOSTIC_DJANGO_HEALTH_URL")
    if explicit:
        return explicit
    base = os.environ.get("APP_API_BASE_URL")
    if base:
        return f"{base.rstrip('/')}/api/v1/health/"
    return "http://django:8000/api/v1/health/"


def nifi_url() -> str:
    return os.environ.get("NIFI_API_URL", "http://apache_nifi:8082/nifi-api/").rstrip("/") + "/flow/about"


def run_once() -> None:
    run_probe(
        "Django",
        lambda: http_check(app_api_url(), 5),
        topic="notifications",
        category="system_health",
        ok_message="TYPE.HEALTH_STATUS.UP",
        fail_message="TYPE.HEALTH_STATUS.DOWN",
    )
    run_probe(
        "PostgreSQL",
        pg_check,
        topic="notifications",
        category="system_health",
        ok_message="TYPE.HEALTH_STATUS.UP",
        fail_message="TYPE.HEALTH_STATUS.DOWN",
    )
    run_probe(
        "Mongo-db",
        lambda: socket_check(os.environ.get("MONGO_SERVER", "mongo-dev"), int(os.environ.get("MONGO_PORT", "27017")), 5),
        topic="notifications",
        category="system_health",
        ok_message="TYPE.HEALTH_STATUS.UP",
        fail_message="TYPE.HEALTH_STATUS.DOWN",
    )
    run_probe(
        "Redis",
        lambda: socket_check(os.environ.get("REDIS_HOST", "redis"), 6379, 5),
        topic="notifications",
        category="system_health",
        ok_message="TYPE.HEALTH_STATUS.UP",
        fail_message="TYPE.HEALTH_STATUS.DOWN",
    )
    run_probe(
        "Apache-kafka",
        lambda: socket_check("broker", 29092, 5),
        topic="notifications",
        category="system_health",
        ok_message="TYPE.HEALTH_STATUS.UP",
        fail_message="TYPE.HEALTH_STATUS.DOWN",
    )
    run_probe(
        "InfluxDB",
        lambda: http_check(os.environ.get("INFLUX_HOST", "http://influxdb1:8086") + "/health", 5),
        topic="notifications",
        category="system_health",
        ok_message="TYPE.HEALTH_STATUS.UP",
        fail_message="TYPE.HEALTH_STATUS.DOWN",
    )
    run_probe(
        "Rabbit-MQ",
        lambda: socket_check("rabbitmq", 5672, 5),
        topic="notifications",
        category="system_health",
        ok_message="TYPE.HEALTH_STATUS.UP",
        fail_message="TYPE.HEALTH_STATUS.DOWN",
    )
    run_probe(
        "MQTT",
        lambda: socket_check("mosquitto", 1883, 5),
        topic="warnings",
        category="connectivity_status",
        ok_message="TYPE.WARNINGS.DATA.RETRIEVAL.INFO",
        fail_message="TYPE.WARNINGS.DATA.RETRIEVAL.FAILED",
        ok_type="Notification",
        fail_type="Warning",
    )
    run_probe(
        "MQTT-Nifi",
        lambda: http_check(nifi_url(), 5),
        topic="warnings",
        category="connectivity_status",
        ok_message="TYPE.WARNINGS.DATA.RETRIEVAL.INFO",
        fail_message="TYPE.WARNINGS.DATA.RETRIEVAL.FAILED",
        ok_type="Notification",
        fail_type="Warning",
    )


if __name__ == "__main__":
    interval = int(os.environ.get("DIAGNOSTIC_PROBE_INTERVAL_SECONDS", "60"))
    while True:
        run_once()
        time.sleep(interval)
