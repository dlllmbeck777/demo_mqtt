import pymongo
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
    source = data_dict.get('source')
    state = data_dict.get('state')
    collection = get_collection(data_dict)

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
