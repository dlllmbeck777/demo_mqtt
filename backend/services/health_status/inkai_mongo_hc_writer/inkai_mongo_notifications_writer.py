import pymongo
from pymongo import MongoClient
import sys
import json
import os

Mongo_Client = "mongodb://admin:admin@mongo-dev:27017/"
Mongo_Db_Name = os.environ.get("Mongo_Notifications_db")

client = MongoClient(Mongo_Client)
mongo_db = client["inkai"]
collection = mongo_db[Mongo_Db_Name]

def process_data(data):
    data_dict = json.loads(data)
    source = data_dict.get('source')
    state = data_dict.get('state')

    collection.create_index([('source', 1)], unique=True)

    existing_document = collection.find_one({'source': source})

    if existing_document and existing_document['state'] != state:
        update_fields = {
            'time': data_dict.get('time'),
            'state': state,
            'priority': data_dict.get('priority'),
            'error_message': data_dict.get('error_message'),
            'is_read': data_dict.get('is_read')
        }
        collection.update_one({'source': source}, {'$set': update_fields})
        print("Data Updated")
    else:
        try:
            collection.insert_one(data_dict)
            print("Data Added:", data_dict)
        except pymongo.errors.DuplicateKeyError:
            print("The same 'source' value already exists")
            pass

    return data_dict

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)

