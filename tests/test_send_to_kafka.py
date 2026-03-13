from kafka import KafkaProducer
import os
import json
import time
import uuid

# Set Kafka host manually or from env
host = os.getenv("Kafka_Host_DP", "localhost:9092")  # Default fallback to localhost

# Kafka producer setup
producer = KafkaProducer(
    bootstrap_servers=host,
    value_serializer=lambda v: json.dumps(v).encode("utf-8"),
)

# Function to send to Kafka
def send_kafka(topic, data):
    future = producer.send(topic, value=data)
    result = future.get(timeout=10)  # Wait for Kafka response
    print(f"✅ Sent to topic '{topic}' at partition {result.partition}, offset {result.offset}")
    print(json.dumps(data, indent=2))

# Function to send a test alarm
def send_alarm_test():
    timestamp = int(time.time() * 1000)
    id = str(uuid.uuid4())
    data = {
        "LOG_TYPE": "Alarm",
        "error_message": "Value of Incoming Data is Out of Bounds",
        "layer": "inkai",
        "priority": 1,
        "short_name": "S01",
        "interval": "5s",
        "source": "sensor01",
        "measurement": "temperature",
        "tag_value": 102.5,
        "tag_quality": "good",
        "time": timestamp,
        "gap": 0,
        "gap_type": "none",
        "asset": "asset_001",
        "category": "alarms",
        "state": "low quality",
        "is_read": False,
        "id": id
    }
    topic = "out_of_alarms"
    send_kafka(topic, data)

# Run test
if __name__ == "__main__":
    send_alarm_test()

