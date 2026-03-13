import redis
import json
import time as timelibrary
import datetime
from kafka import KafkaConsumer
import os
import base64

# Create a Redis Connection
Redis_Db_Name = os.environ.get("Redis_Db_Name")
rds = redis.StrictRedis(Redis_Db_Name, port=6379, db=1)
# Create Kafka Consumer
host = os.environ.get("Kafka_Host_DP")
consumer = KafkaConsumer("live_data", bootstrap_servers=host)


def created_redis_db(key, columns):
    try:
        created_databases = rds.ts().create(key, labels=columns)
        return created_databases
    except:
        print("This database name already exist.")


def add_to_created_database(key, timestamp, value, columns):
    try:
        rds.ts().add(key, timestamp, value, labels=columns)
        return 1
    except:
        print("This timestamp already exist.")


def convert_to_time(time):
    timestamp_for_redis = int(
        timelibrary.mktime(
            datetime.datetime.strptime(time, "%Y-%m-%d %H:%M:%S.%f").timetuple()
        )
    )
    return timestamp_for_redis


for msg in consumer:
    data = json.loads(msg.value)
    time_for_redis = convert_to_time(data["payload"]["insert"][0]["vqts"][0]["t"])
    print(time_for_redis)
    # ----------------- VALUES -----------------
    columns = {
        "completion": data["header"]["asset"],
        "version": data["header"]["version"],
        "created_by": data["header"]["created_by"],
        "createdTime": data["header"]["createdTime"],
        "message_type": data["header"]["message_type"],
        "layer": data["header"]["layer"],
        "asset": data["header"]["asset"],
        "timestamp": data["payload"]["insert"][0]["vqts"][0]["t"],
        "quality": data["payload"]["insert"][0]["vqts"][0]["q"],
        "tag_value": data["payload"]["insert"][0]["vqts"][0]["v"],
        "tag_name": data["payload"]["insert"][0]["fqn"],
        "uom": data["payload"]["insert"][0]["vqts"][0]["s"],
    }
    timestamp = str(time_for_redis)
    value = str(data["payload"]["insert"][0]["vqts"][0]["v"])
    key_times = timestamp
    print(key_times)
    key = data["payload"]["insert"][0]["fqn"] + ":" + key_times
    # ------------------------------------------
    # Create Redis Db
    print(columns)
    created_redis_db(key, columns)
    # ------------------------------------------
    # Add Value to Created Redis Db
    add_to_created_database(key, timestamp, value, columns)
    print("Complete")
    # ------------------------------------------
    mget_filters = ["completion=15"]
    mget_reply = rds.ts().mget(mget_filters, with_labels=True)
    print(json.dumps(mget_reply, indent=4) + "\n")
    # Redis Cli Command --> TS.MGET WITHLABELS FILTER area_id=20
