from pymongo import MongoClient
from kafka import KafkaConsumer
from ast import literal_eval
import json
import time as timelibrary
import datetime
import os
import uuid

topic = os.environ.get("Kafka_Alarms_Topic")
host = os.environ.get("Kafka_Host_DP")
mongo_client = os.environ("Mongo_Client")
db_name = os.environ("MongoDb_alarms_Name")
consumer = KafkaConsumer(topic, bootstrap_servers=host)

client = MongoClient(client)
mongo_db = client[db_name]
timeseries_collection = mongo_db[db_name]


def convert_to_time(time):
    date_format = "%Y-%m-%d %H:%M:%S.%f"
    date_obj = datetime.datetime.strptime(time, date_format)
    timestamp = int(date_obj.timestamp())
    return timestamp


for message in consumer:
    df = message.value.decode("utf-8")
    data = json.loads(df)
    time_for_mongo = convert_to_time(data["date"])
    timestamp = str(time_for_mongo)
    data["timestamp"] = timestamp
    data["row_id"] = uuid.uuid4().hex
    timeseries_collection.insert_one(data)
