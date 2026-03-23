from pymongo import MongoClient
import sys
import json
import os

Mongo_Client = os.environ.get("Mongo_Client", "mongodb://admin:admin@mongo-dev:27017/")
Mongo_Db_Name = os.environ.get("Mongo_Warnings_db")

client = MongoClient(Mongo_Client)


def get_collection(data_dict):
    layer_name = str(
        data_dict.get("layer")
        or os.environ.get("DIAGNOSTIC_LAYER_NAME")
        or os.environ.get("COMPANY_NAME")
        or "Inkai"
    ).strip().lower()
    mongo_db = client[layer_name]
    return mongo_db[Mongo_Db_Name]

def process_data(data):
    data_dict = json.loads(data)
    collection = get_collection(data_dict)
    collection.insert_one(data_dict)
    return data_dict


for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)
