from pymongo import MongoClient
import os


def mongo_update_unread_notifications(status=None):
    # MongoDB bağlantısı oluşturun
    mongo_client = MongoClient(os.environ.get("Mongo_Client"))

    # Koleksiyon isimlerini belirleyin
    collection_names = "alarms"

    data = []

    db = mongo_client[collection_names]
    collection = db[collection_names]
    query = (
        {"layer": "Inkai", "is_read": False, "id": status}
        if status != "all"
        else {"layer": "Inkai", "is_read": False}
    )
    result_data = collection.find(query).sort([("time", -1)]).limit(100)
    if result_data:
        # Seçilen belgelerin "is_read" alanını güncelle
        collection.update_many(
            {"_id": {"$in": [doc["_id"] for doc in result_data]}},
            {"$set": {"is_read": True}},
        )
        mongo_client.close()


# id_to_filter = "belirli_bir_id"  # sadece belirli bir id'ye göre filtrelemek isterseniz
# result_data = get_data(id_to_filter)
# print(result_data)
