from pymongo import MongoClient
import os
import requests
from kafka import KafkaProducer
import json

bootstrap_server = os.environ.get(
    "KAFKA_BOOTSTRAP_SERVERS",
    os.environ.get("Kafka_Host_DP", os.environ.get("Kafka_Host", "broker:29092")),
)
base_url = os.environ.get("BACKEND_BASE_URL", "http://localhost:8000")
layer_name = str(
    os.environ.get("LEGACY_LAYER_NAME")
    or os.environ.get("DIAGNOSTIC_LAYER_NAME")
    or os.environ.get("COMPANY_NAME")
    or "STD"
).strip()
layer_slug = layer_name.lower()
mongo_db_name = str(os.environ.get("LEGACY_MONGO_DB_NAME") or layer_slug).strip().lower()
asset_topic = os.environ.get(
    "LEGACY_MONGO_ASSET_ACCELERATION_TOPIC",
    f"{layer_slug}_mongo_acc_asset_data",
)

producer = KafkaProducer(
    bootstrap_servers=bootstrap_server,
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)

client = MongoClient(
    os.environ.get("MONGO_CLIENT")
    or os.environ.get("Mongo_Client")
    or "mongodb://admin:admin@mongo-dev:27017/"
)
db = client[mongo_db_name]
collection = db['vibration_data']  

url = base_url + f"/api/v1/item-property/get/rpm/{layer_name}/"

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
        producer.send(asset_topic, value=latest_2048_data)
        producer.flush()

        for document in data_to_delete:
            collection.delete_one({"_id": document["_id"]})
