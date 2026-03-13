import influxdb_client
from influxdb_client.client.write_api import SYNCHRONOUS
import os
from kafka import KafkaConsumer
import json 
import datetime

topic = "inkai-live-data"
host = os.environ.get("Kafka_Host_DP")
consumer = KafkaConsumer(topic, bootstrap_servers=host)

token = "JWWy8AiTrGsHBPJdYx6Fh1vnsX5J8mmeaXk4a2yDivvpN0X2lZdn7I7JkCu4tWFaefbEWS3Q-0ch8L0ogbcj2g=="
url = "http://influxdb1:8086"
org = "nordal"
bucket = "inkai-live-data"
def write_influx(data,send_time):
    client = influxdb_client.InfluxDBClient(
        url=url,
        token=token,
        org=org
    )

    write_api = client.write_api(write_options=SYNCHRONOUS)

    p = influxdb_client.Point(data["payload"]["insert"][0]["fqn"]).tag("version", data["header"]["version"]).tag("message_type", data["header"]["message_Type"]).tag("layer", data["header"]["layer"]).field("quality", data["payload"]["insert"][0]["vqt"][0]["q"]).field("tag_value", data["payload"]["insert"][0]["vqt"][0]["v"]).time(send_time)
    write_api.write(bucket=bucket, org=org, record=p)

for msg in consumer:
    data = json.loads(msg.value)
    times = datetime.datetime.strptime(data["header"]["createdTime"], "%Y-%m-%d %H:%M:%S.%f")
    send_time = times.strftime("%Y-%m-%dT%H:%M:%SZ")
    write_influx(data,send_time)
