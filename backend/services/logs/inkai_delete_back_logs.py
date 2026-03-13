from pymongo import MongoClient
from kafka import KafkaProducer
from datetime import datetime, timedelta
import os
import time
import json 
from bson import json_util 

host = os.environ.get('Kafka_Host_DP')
Mongo_Client = os.environ.get('Mongo_Client')
Mongo_Db_Name = os.environ.get('Mongo_Logs_db')

client = MongoClient(Mongo_Client)
db = client["inkai"]
collection = db[Mongo_Db_Name]

dayago = time.time() * 1000 - 86400000

documents_to_delete = list(collection.find({"time": {"$lt": dayago}}))

producer = KafkaProducer(bootstrap_servers=host, value_serializer=lambda v: json.dumps(v, default=json_util.default).encode('utf-8'))

for data in documents_to_delete:
    data = json.loads(json_util.dumps(data))
    producer.send("inkai-backfill-logs", value=data)
    producer.flush()

producer.close()

result = collection.delete_many({"time": {"$lt": dayago}})