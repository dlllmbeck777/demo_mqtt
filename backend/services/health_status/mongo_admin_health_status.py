import requests
import os
from helper import send_alarm, get_health_status_messages
from urllib.parse import urljoin

BASE_URL = "http://"
HOST = os.environ.get("IP_ADRESS")
PORT = os.environ.get("MONGO_ADMIN_PORT")
URL = f"http://{HOST}:{PORT}"
USERNAME = os.environ.get("MONGO_USER_NAME")
PASSWORD = os.environ.get("MONGO_USER_PASS")

def check_connection(url, username, password):
    try:
        response = requests.get(url, auth=(username, password))
        response.raise_for_status()
        error_message = get_health_status_messages("UP", "en-US")
        send_alarm(source="Mongo-Express")
    except requests.exceptions.RequestException as e:
        error_message = get_health_status_messages("DOWN", "en-US")
        send_alarm(error_message=error_message, source="Mongo-Express", state="Stopped")

check_connection(URL,USERNAME,PASSWORD)
