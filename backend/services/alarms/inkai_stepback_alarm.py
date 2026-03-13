from pymongo import MongoClient
import os
client =  os.environ.get("Mongo_Client")

client = MongoClient(client)
stepback_alarm_db = client["inkai"]
alarm_db = client['inkai']

distinct_tag_names = stepback_alarm_db.alarms.distinct("measurement")

for tag_name in distinct_tag_names:
    latest_data = stepback_alarm_db.alarms.find({"measurement": tag_name}).sort("time", -1).limit(1)
    for data in latest_data:
        alarm_db.alarms.insert_one(data)
    stepback_alarm_db.alarms.delete_many({"measurement": tag_name})

client.close()
