import requests
import os
from helper import send_alarm, get_health_status_messages

INFLUXDB_URL = os.environ.get("INFLUX_HOST", "http://influxdb1:8086").replace("/api/v1", "").rstrip("/")


def check_influxdb_health():
    influxdb_url = f"{INFLUXDB_URL}/ping"

    try:
        response = requests.get(influxdb_url)
        response.raise_for_status()
        error_message = get_health_status_messages("UP", "en-US")
        send_alarm(source="influxdb", error_message=error_message)
        print('UP')
    except Exception as e:
        error_message = get_health_status_messages("DOWN", "en-US")
        print('DOWN ',str(e))

        send_alarm(error_message=error_message, source="influxdb", state="Stopped")


check_influxdb_health()
