import threading
from influxdb_client import InfluxDBClient
from pymongo import MongoClient, DESCENDING
import os
from utils.service_config import (
    INFLUX_ALARMS_BUCKET,
    INFLUX_ANOMALY_BUCKET,
    INFLUX_LIVE_BUCKET,
    INFLUX_LOGS_BUCKET,
    INFLUX_NOTIFICATIONS_BUCKET,
    INFLUX_ORG,
    INFLUX_TOKEN,
    INFLUX_URL,
)

INFLUX_BUCKET = INFLUX_LIVE_BUCKET


def _get_tags_queryset(tag_id):
    from apps.tags.models import tags

    return tags.objects.filter(TAG_ID=tag_id)


def _serialize_tag(tag_queryset):
    from apps.tags.serializers import TagsFieldsSerializer

    return TagsFieldsSerializer(tag_queryset, many=True).data[0]


def find_tag(tag_id):
    tag = _get_tags_queryset(tag_id)
    if tag:
        serializer = _serialize_tag(tag)
        # asset, tag_name = serializer.get("NAME").split(".")
        # return tag_name, asset
        return serializer.get("NAME")
    else:
        raise BaseException("Tags not found")


def retive_live_data(
    start_time="-", end_time="+", tag_name="", asset="", redis="", withlabes=False
):
    data = redis.mrange(
        start_time,
        end_time,
        ["tag_name=" + tag_name],
        empty=True,
        with_labels=withlabes,
    )
    try:
        start_time = list(data[-1].values())[0][1][0][0] + 1
        # print(start_time)

        return start_time, end_time, data
    except Exception as e:
        print(str(e))
        return start_time, end_time


def retive_last_data(tag_name="", asset="", redis=""):
    query = ["tag_name=" + tag_name]
    data = redis.mget(query, latest=False)
    data = data[-1]
    data = [[item[1], item[2]] for item in data.values()]
    return data


def retrieve_backfill_data(collection, query):
    data = list(collection.find(query, {"_id": 0}))
    return data


def createThread(function):
    thread = threading.Thread(target=function)
    thread.start()
    return thread


def delThread(thread):
    # I delete the previous thread in every message because filtering
    # the old data while new data is coming in may break the order
    thread.join()
    del thread


def retive_influx_live_data(start_time="-", end_time="+", tag_names=""):
    with InfluxDBClient(
        url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG, debug=False
    ) as client:
        query = f"""  from(bucket: "{INFLUX_BUCKET}")
        |> range(start: {start_time})
        |> filter(fn: (r) => r["_field"] == "tag_value")
        |> filter(fn: (r) =>"""
        index = 0
        try:
            for tag_name in tag_names:
                s = f"""r["_measurement"] == "{tag_name}" """
                query += s
                if index != len(tag_names) - 1:
                    query += " or "
                index += 1
            query += ")"
            result = client.query_api().query(query)
            data = []
            for table in result:
                for record in table.records:
                    data.append(record.values)
            return data
        except Exception as e:
            print(str(e))
            return []


def retive_influx_anomaly_live_data(start_time="-", end_time="+", tag_names=""):
    my_bucket = INFLUX_ANOMALY_BUCKET

    with InfluxDBClient(
        url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG, debug=False
    ) as client:
        query = f"""  from(bucket: "{my_bucket}")
        |> range(start: {start_time})
        |> filter(fn: (r) => r["_field"] == "tag_value")
        |> filter(fn: (r) => r["tag_quality"] == "100" or r["tag_quality"] == "192" or r["tag_quality"] == "60" or r["tag_quality"] == "66" or r["tag_quality"] == "67")
        |> filter(fn: (r) =>"""
        index = 0
        try:
            for tag_name in tag_names:
                s = f"""r["_measurement"] == "{tag_name}" """
                query += s
                if index != len(tag_names) - 1:
                    query += " or "
                index += 1
            query += ")"
            result = client.query_api().query(query)
            data = []
            for table in result:
                for record in table.records:
                    data.append(record.values)

            return data
        except Exception as e:
            print(str(e))
            return []


def retive_influx_last_data(tag_name=""):
    try:
        
        with InfluxDBClient(
            url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG, debug=False
        ) as client:
            query = f"""from(bucket: "{INFLUX_BUCKET}") 
                        |> range(start: -5m)
                        |> filter(fn: (r) => r["_field"] == "tag_value")
                        |> filter(fn: (r) => r["_measurement"] == "{tag_name}")
                        |> last()
                        |> group()
                        |> sort(columns: ["_time"], desc: true)
                        |> limit(n: 1)
                        """

            result = client.query_api().query(query=query)
            #print('result for Daniyar',result)
            # Sonuçları işleme
            if result:
                for table in result:
                    # return table.record[-1].values
                    for record in table.records:
                        return record.values
            return []
    except Exception as e:
        print(str(e))
        #print('Daniyars error 2')

def retrive_alarms(category="system_health", my_bucket=INFLUX_ALARMS_BUCKET, start_time="-168h"):
    try:
        with InfluxDBClient(
            url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG, debug=False
        ) as client:
            query = f"""from(bucket: "{my_bucket}")
                        |> range(start: {start_time})
                        |> filter(fn: (r) => r["category"] == "{category}")
                        """

            result = client.query_api().query(query=query)
            # Sonuçları işleme
            data = []
            for table in result:
                # return table.record[-1].values
                for record in table.records:
                    data.append(record.values)

            return data

    except Exception as e:
        print(str(e), "burda hata")
    try:
        with InfluxDBClient(
            url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG, debug=False
        ) as client:
            query = f"""from(bucket: "{my_bucket}")
                        |> range(start: {start_time})
                        |> filter(fn: (r) => r["category"] == "{category}")
                        """

            result = client.query_api().query(query=query)
            # Sonuçları işleme
            data = []
            for table in result:
                # return table.record[-1].values
                for record in table.records:
                    data.append(record.values)

            return data
    except Exception as e:
        print(str(e))


# def retrive_notifications(
#     category="notifications", my_bucket="inkai_notifications", hours=(10)
# ):
#     try:
#         with InfluxDBClient(
#             url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG, debug=False
#         ) as client:
#             query = f"""from(bucket: "{my_bucket}")
#                         |> range(start: -{hours}h)
#                         |> filter(fn: (r) => r["category"] == "{category}")
#                         """

#             result = client.query_api().query(query=query)
#             # Sonuçları işleme
#             data = []
#             for table in result:
#                 # return table.record[-1].values
#                 for record in table.records:
#                     data.append(record.values)

#             return data

#     except Exception as e:
#         print(str(e))


def retrive_live_notifications(
    category="notifications",
    my_bucket=INFLUX_NOTIFICATIONS_BUCKET,
    start_time="-1h",
):
    try:
        with InfluxDBClient(
            url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG, debug=False
        ) as client:
            query = f"""from(bucket: "{my_bucket}")
                        |> range(start: {start_time})
                        |> filter(fn: (r) => r["category"] == "{category}")
                        """

            result = client.query_api().query(query=query)
            # Sonuçları işleme
            data = []
            for table in result:
                # return table.record[-1].values
                for record in table.records:
                    data.append(record.values)

            return data

    except Exception as e:
        print(str(e))


def retrive_logs(category="notifications", my_bucket=INFLUX_LOGS_BUCKET, start_time="-1h"):
    try:
        with InfluxDBClient(
            url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG, debug=False
        ) as client:
            query = f"""from(bucket: "{my_bucket}")
                        |> range(start: {start_time})
                        |> filter(fn: (r) => r["category"] == "{category}")
                        """

            result = client.query_api().query(query=query)
            # Sonuçları işleme
            data = []
            for table in result:
                # return table.record[-1].values
                for record in table.records:
                    data.append(record.values)

            return data

    except Exception as e:
        print(str(e))


def retrive_total_notifications(
    category="notifications",
    my_bucket=INFLUX_NOTIFICATIONS_BUCKET,
    hours=(3),
):
    try:
        with InfluxDBClient(
            url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG, debug=False
        ) as client:
            query = f"""from(bucket: "{my_bucket}")
                        |> range(start: -{hours}h)
                        """

            result = client.query_api().query(query=query)
            # Sonuçları işleme
            data = []
            for table in result:
                # return table.record[-1].values
                for record in table.records:
                    data.append(record.values)

            return data

    except Exception as e:
        print(str(e))


def retrive_mongo_notifications(db_name, collections, query):
    mongo_client = MongoClient(os.environ.get("Mongo_Client"))
    db = mongo_client[db_name]
    collection = db[collections]
    # İlgili veriyi bulun
    projection = {"_id": 0}
    latest_data = collection.find(query or {}, projection).sort([("time", DESCENDING)]).limit(500)
    # query["is_read"] = False
    data = []
    for item in latest_data:
        data.append(item)
    mongo_client.close()
    return data


def retrive_mongo_notifications(
    db_name="", collections="", query="", is_aggregate=False
):
    mongo_client = MongoClient(os.environ.get("Mongo_Client"))
    db_name = str(db_name).lower()
    print(db_name)
    db = mongo_client[db_name]
    collection = db[collections]
    # İlgili veriyi bulun
    projection = {"_id": 0}

    latest_data = collection.find(query, projection)
    # query["is_read"] = False
    data = []
    for item in latest_data:
        data.append(item)
    mongo_client.close()
    return data


def retrive_mongo_widget_data(db_name="", collections="", query="", is_aggregate=False):
    mongo_client = MongoClient(os.environ.get("Mongo_Client"))
    db_name = str(db_name).lower()
    db = mongo_client[db_name]
    collection = db[collections]
    # İlgili veriyi bulun
    projection = {"_id": 0}
    latest_data = collection.find(query, projection).sort([("time", -1)]).limit(100)
    # query["is_read"] = False
    data = []
    for item in latest_data:
        print("item")
        data.append(item)
    mongo_client.close()
    return data


def retrive_mongo_LastData(db_name="", collections="", query="", is_aggregate=False):
    mongo_client = MongoClient(os.environ.get("Mongo_Client"))
    db_name = str(db_name).lower()
    db = mongo_client[db_name]
    collection = db[collections]
    # İlgili veriyi bulun
    projection = {"_id": 0}

    latest_data = collection.find(query, projection).limit(10)
    # query["is_read"] = False
    data = []
    for item in latest_data:
        data.append(item)
    mongo_client.close()
    return data


def retrive_last_mongo_warnings(db_name, collections, query):
    mongo_client = MongoClient(os.environ.get("Mongo_Client"))
    db_name = str(db_name).lower()
    db = mongo_client[db_name]
    collection = db[collections]
    projection = {"_id": 0}
    latest_document = collection.find_one(
        query,
        projection=projection,
        sort=[("time", DESCENDING)],
    )
    # query["is_read"] = False
    data = []
    # for item in latest_document:
    #     item.pop("_id")
    #     data.append(item)
    mongo_client.close()
    data.append(latest_document)
    return data


def retrive_mongo_zil(query, db_name):
    mongo_client = MongoClient(os.environ.get("Mongo_Client"))
    collections = ["alarms", "warnings"]
    data = []

    db = mongo_client[db_name]
    for collections in collections:
        collection = db[collections]
        # İlgili veriyi bulun
        projection = {"_id": 0}
        latest_data = collection.find(query, projection)
        for item in latest_data:
            data.append(item)
    mongo_client.close()
    return data


def retrive_mongo_anomaly(query, db_name):
    mongo_client = MongoClient(os.environ.get("Mongo_Client"))
    collections = ["anomaly_data"]
    data = []
    db = mongo_client[db_name]
    for collections in collections:
        collection = db[collections]
        # İlgili veriyi bulun
        projection = {"_id": 0}
        latest_data = collection.find(query, projection)
        for item in latest_data:
            data.append(item)
        print(len)
    mongo_client.close()
    return data
