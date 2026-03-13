import time
import paho.mqtt.client as mqtt
import os
from helper import send_alarm, get_warning_messages

broker_address = os.environ["MQTT_BROKER_ADDRESS"]
broker_port = int(os.environ["MQTT_PORT"])
topic_to_listen = os.environ["MQTT_TOPIC"]
print(topic_to_listen)
#topic_to_listen = 'horasan'
topic_to_listen = 'inkai'

data_received = False
timeout = 10


def on_message(client, userdata, message):
    global data_received
    data_received = True


client = mqtt.Client()
client.on_message = on_message
client.connect(broker_address, broker_port)

client.subscribe(topic_to_listen)
client.loop_start()

start_time = time.time()

while time.time() - start_time < timeout:
    if data_received:
        message = get_warning_messages("INFO", "en-US")
        send_alarm(
            source="MQTT-Broker",
            category="connectivity_status",
            topic="warnings",
            error_message=message,
        )
        break
    time.sleep(1)

if not data_received:
    message = get_warning_messages("FAILED", "en-US")
    send_alarm(
        error_message=message,
        source="MQTT-Broker",
        category="connectivity_status",
        state="Stopped",
        alarms_type="Warning",
        topic="warnings",
    )

client.loop_stop()
client.disconnect()
