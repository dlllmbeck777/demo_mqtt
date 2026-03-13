from pymongo import MongoClient
from kafka import KafkaProducer
import os
import time
import json
from bson import ObjectId

host = os.environ.get('Kafka_Host_DP')
Mongo_Client = os.environ.get("Mongo_Client")

client = MongoClient(Mongo_Client)
db = client["inkai"]
collection = db[os.environ.get('Mongo_Alarms_db')]

dayago = time.time() * 1000 - 86400000

def serialize_document(doc):
    doc['_id'] = str(doc['_id'])
    return doc

documents_to_delete = list(collection.find({"time": {"$lt": dayago}}))
producer = KafkaProducer(bootstrap_servers=host, value_serializer=lambda v: json.dumps(serialize_document(v)).encode("utf-8"))

for data in documents_to_delete:
    producer.send("inkai-backfill-alarms", value=data)
    producer.flush()

producer.close()

result = collection.delete_many({"time": {"$lt": dayago}})
