from pymongo import MongoClient
import sys
import json
import os

Mongo_Client = os.environ.get("Mongo_Client")
Mongo_Db_Name = os.environ.get("Mongo_Logs_db")

client = MongoClient(Mongo_Client)
mongo_db = client[Mongo_Db_Name]
collection = mongo_db[Mongo_Db_Name]

def process_data(data):
    data_dict = json.loads(data)
    collection.insert_one(data_dict)
    return data_dict


for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)
