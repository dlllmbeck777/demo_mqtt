import paho.mqtt.client as mqtt
import os
from helper import send_alarm, get_health_status_messages


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker")
    else:
        print("Connection to MQTT broker failed")


def check_mqtt_broker_health():
    MQTT_BROKER_ADDRESS = os.environ["MQTT_BROKER_ADDRESS"]
    MQTT_PORT = int(os.environ["MQTT_PORT"])

    client = mqtt.Client()
    client.on_connect = on_connect

    try:
        client.connect(MQTT_BROKER_ADDRESS, MQTT_PORT, keepalive=10)
        client.loop_start()
        error_message = get_health_status_messages("UP", "en-US")
        send_alarm(source="MQTT")
    except:
        error_message = get_health_status_messages("DOWN", "en-US")
        send_alarm(error_message=error_message, source="MQTT", state="Stopped")


check_mqtt_broker_health()
