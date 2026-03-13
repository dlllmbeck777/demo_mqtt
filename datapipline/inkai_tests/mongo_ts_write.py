from pymongo import MongoClient
from kafka import KafkaConsumer
from ast import literal_eval
import json
import time as timelibrary
import datetime
import os

topic = "backfill_data"
host = os.environ.get("Kafka_Host_DP")
consumer = KafkaConsumer(topic, bootstrap_servers=host)
Mongo_Db_Name = os.environ.get("Mongo_Db_Name")
client = MongoClient(os.environ.get("Mongo_Client"))
mongo_db = client[Mongo_Db_Name]
timeseries_collection = mongo_db[Mongo_Db_Name]


def convert_to_time(time):
    timestamp_for_mongo = int(
        timelibrary.mktime(
            datetime.datetime.strptime(time, "%Y-%m-%d %H:%M:%S.%f").timetuple()
        )
    )
    return timestamp_for_mongo


for message in consumer:
    df = message.value
    data = literal_eval(df.decode("utf-8"))
    time_for_mongo = convert_to_time(data["payload"]["insert"][0]["vqts"][0]["t"])
    timestamp = str(time_for_mongo)
    key_times = timestamp
    key = data["payload"]["insert"][0]["fqn"] + ":" + key_times
    columns = {
        "completion": data["header"]["asset"],
        "version": data["header"]["version"],
        "created_by": data["header"]["created_by"],
        "createdTime": data["header"]["createdTime"],
        "message_type": data["header"]["message_type"],
        "layer": data["header"]["layer"],
        "asset": data["header"]["asset"],
        "date": data["payload"]["insert"][0]["vqts"][0]["t"],
        "timestamp": key_times,
        "quality": data["payload"]["insert"][0]["vqts"][0]["q"],
        "tag_value": data["payload"]["insert"][0]["vqts"][0]["v"],
        "tag_name": data["payload"]["insert"][0]["fqn"],
        "uom": data["payload"]["insert"][0]["vqts"][0]["s"],
    }
    new_data = {
        key: [
            columns,
            [
                [
                    key_times,
                    data["payload"]["insert"][0]["vqts"][0]["v"],
                ]
            ],
        ]
    }
    print(new_data)
    timeseries_collection.insert_one(columns)
    # for doc in timeseries_collection.find():
    #     print(doc)
