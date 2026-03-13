# from pymongo import MongoClient

# Mongo_Db_Name = "alarms"
# client = MongoClient("mongodb://root:admin@overlay2:27017/")
# mongo_db = client[Mongo_Db_Name]
# collection = mongo_db[Mongo_Db_Name]

# all_documents = collection.find()

# for document in all_documents:
#     print(document)


#how can ı add data to mongo python example
import pymongo

client = pymongo.MongoClient("mongodb://admin:pass@mongo-dev:27017/") 
db = client["test"] 
collection = db["test"] 

data_to_insert = {
    "name": "John",
    "age": 30,
    "city": "New York"
}
inserted_data = collection.insert_one(data_to_insert)
inserted_id = inserted_data.inserted_id
print("added data's id", inserted_id)

client.close()
