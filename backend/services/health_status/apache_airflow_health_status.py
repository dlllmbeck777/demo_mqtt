import requests
import json
import os
from helper import send_alarm, get_health_status_messages
from kafka import KafkaProducer

IP_ADRESS = os.environ["ALLOWED_HOSTS"]
AIRFLOW_PORT = 8080


def check_airflow_health():
    try:
        response = requests.get("http://" + IP_ADRESS + ":8080/health")
        healt_status = json.loads(response.text)
        if healt_status["metadatabase"]["status"] == "healthy":
            error_message = get_health_status_messages("UP", "en-US")
            send_alarm(error_message=error_message, source="AirFlow")
    except Exception as e:
        error_message = get_health_status_messages("DOWN", "en-US")
        send_alarm(error_message=error_message, source="AirFlow")


check_airflow_health()
