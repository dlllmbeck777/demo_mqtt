from kafka import KafkaConsumer
import os
import datetime
from kafka import KafkaProducer
import json
from helper import send_alarm, get_health_status_messages

host = os.environ["Kafka_Host_DP"]


def kafkaHealthCheck():
    try:
        consumer = KafkaConsumer(
            bootstrap_servers=host,
            enable_auto_commit=False,
            auto_offset_reset="earliest",
        )
        consumer.topics()
        error_message = get_health_status_messages("UP", "en-US")
        print('Host: ',host)
        print(error_message)
        send_alarm(source="Apache-kafka", error_message=error_message)
    except Exception as e:
        error_message = get_health_status_messages("DOWN", "en-US")
        send_alarm(error_message=error_message, source="Apache-kafka", state="Stopped")


kafkaHealthCheck()

# host = os.environ["Kafka_Host_DP"]
# producer = KafkaProducer(
#     bootstrap_servers=host,
#     value_serializer=lambda v: json.dumps(v).encode("ascii"),
# )
# created_time = datetime.datetime.now()

# try:
#     consumer = KafkaConsumer(
#         bootstrap_servers=host,
#         enable_auto_commit=False,
#         auto_offset_reset="earliest",
#     )
#     consumer.topics()
#     print("Ok")
# except Exception as e:
#     error_message = f"Kafka health check failed: {e}"
#     data = {
#         "LOG_TYPE": "Alarm",
#         "date": created_time,
#         "layer_name": "KNOC",
#         "error_message": error_message,
#         "container": "Apache-kafka",
#     }
#     producer.send("alarms", value=data)
#     producer.flush()
