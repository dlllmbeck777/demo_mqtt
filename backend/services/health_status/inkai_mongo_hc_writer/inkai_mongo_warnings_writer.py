from pymongo import MongoClient
import sys
import json
import os

Mongo_Client = "mongodb://admin:admin@mongo-dev:27017/"
Mongo_Db_Name = os.environ.get("Mongo_Warnings_db")

client = MongoClient(Mongo_Client)
mongo_db = client["inkai"]
collection = mongo_db[Mongo_Db_Name]

def process_data(data):
    data_dict = json.loads(data)
    collection.insert_one(data_dict)
    return data_dict


for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)
