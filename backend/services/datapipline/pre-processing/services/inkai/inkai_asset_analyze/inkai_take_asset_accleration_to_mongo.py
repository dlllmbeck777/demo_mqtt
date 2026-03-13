from pymongo import MongoClient
import os
import requests
from kafka import KafkaProducer
import json

bootstrap_server = os.environ.get('Kafka_Host_DP')
base_url = os.environ.get('BACKEND_BASE_URL')

producer = KafkaProducer(
    bootstrap_servers=bootstrap_server,
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)

client = MongoClient(os.environ.get("Mongo_Client"))
db = client['inkai']
collection = db['vibration_data']  

url = base_url +"/api/v1/item-property/get/rpm/"

response = requests.get(url)

data = response.json()
asset_names = key_list = [list(item.keys())[0] for item in data]

for asset_name in asset_names:
    count = collection.count_documents({"asset": asset_name})
    latest_2048_data = []
    data_to_delete = []
    if count > 2048:
        latest_2048_documents = collection.find({"asset": asset_name}).sort("_id", -1).limit(2048)
        for document in latest_2048_documents:
            document_id = document["_id"]
            data_to_delete.append({"_id": document_id})
            del document['_id']
            latest_2048_data.append(document)
        producer.send("inkai_mongo_acc_asset_data", value=latest_2048_data)
        producer.flush()

        for document in data_to_delete:
            collection.delete_one({"_id": document["_id"]})