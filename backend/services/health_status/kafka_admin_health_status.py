import http.client
import os
from helper import send_alarm, get_health_status_messages


def check_connection(host, port):
    try:
        connection = http.client.HTTPConnection(host, port, timeout=10)
        connection.request("GET", "/")
        response = connection.getresponse()

        if response.status == 200:
            error_message = get_health_status_messages("UP", "en-US")
            send_alarm(source="Kafka-Control-Center")

        else:
            error_message = get_health_status_messages("DOWN", "en-US")
            send_alarm(
                error_message=error_message,
                source="Kafka-Control-Center",
                state="Stopped",
            )

        connection.close()
    except Exception as e:
        error_message = get_health_status_messages("DOWN", "en-US")
        send_alarm(
            error_message=error_message, source="Kafka-Control-Center", state="Stopped"
        )


host = os.environ["IP_ADRESS"]
port = 9021
check_connection(host, port)
