import pandas as pd
from datetime import datetime
import json
from dateutil import parser
import os
import numpy as np
from kafka import KafkaProducer
from confluent_kafka.serialization import StringSerializer


def send_to_kafka(raw_data):
    producer.send("raw-data", value=raw_data)


producer = KafkaProducer(
    bootstrap_servers=os.environ.get("Kafka_Host"),
    value_serializer=StringSerializer(),
    linger_ms=10,
)

file_name = ""
with os.scandir(os.getcwd()) as entries:
    for entry in entries:
        if entry.name.endswith(".csv"):
            file_name = entry.name
            break

data = pd.read_csv(file_name, sep=";", encoding="WINDOWS-1251")
data = data.astype(object).replace(np.nan, None)
keys = data.keys()

for row_index in range(len(data)):
    for keys_index in range(6, len(keys)):
        raw_data = {}
        raw_data["completion"] = data[keys[1]][row_index]
        raw_data["created_by"] = data[keys[4]][row_index]
        raw_data["date"] = data[keys[5]][row_index]
        raw_data["tag_name"] = keys[keys_index].split(",")[0]
        tag_name = keys[keys_index].split(",")[0]

        if "(" in keys[keys_index].split(",")[0]:
            tag_name = tag_name.replace("(", "")
            tag_name = tag_name.replace(")", "")

        raw_data["tag_name"] = tag_name

        try:
            datetime_object = parser.parse(raw_data["date"])
        except:
            continue

        if len(keys[keys_index].split(",")) > 1:
            raw_data["uom"] = keys[keys_index].split(",")[1]
        else:
            raw_data["uom"] = "blank"

        if data[keys[keys_index]][row_index] is not None:
            raw_data["tag_value"] = float(data[keys[keys_index]][row_index])
            raw_data = json.dumps(raw_data, ensure_ascii=False)
            # print(raw_data)
            send_to_kafka(raw_data)

os.remove(file_name)


# from ast import literal_eval
# import pandas as pd
# from datetime import datetime
# import json
# from datetime import datetime
# from dateutil import parser
# import os
# import numpy as np
# from kafka import KafkaProducer
# from confluent_kafka.serialization import StringSerializer

# producer = KafkaProducer(
#     bootstrap_servers=os.environ.get("Kafka_Host"),
#     value_serializer=StringSerializer(),
#     linger_ms=10,
# )
# file_name = ""
# with os.scandir(os.getcwd()) as find:
#     for file in find:
#         if file.name.endswith("csv"):
#             file_name = file.name

# file_name = " "
# with os.scandir(os.getcwd()) as find:
#     for file in find:
#         if file.name.endswith("csv"):
#             file_name = file.name


# data = pd.read_csv(file_name, sep=";", encoding="WINDOWS-1251")
# data = data.astype(object).replace(np.nan, None)
# keys = data.keys()
# for row_index in range(len(data)):
#     for keys_index in range(6, len(keys)):
#         raw_data = {}
#         raw_data["completion"] = data[keys[1]][row_index]
#         raw_data["created_by"] = data[keys[4]][row_index]
#         raw_data["date"] = data[keys[5]][row_index]
#         tag_name = keys[keys_index].split(",")[0]
#         if "(" in keys[keys_index].split(",")[0]:
#             tag_name = tag_name.replace("(", "")
#             tag_name = tag_name.replace(")", "")
#         raw_data["tag_name"] = tag_name

#         # if ")" in keys[keys_index].split(",")[0]:
#         #     tag_name = keys[keys_index].split(",")[0].replace(")", "")

#         try:
#             datetime_object = parser.parse(raw_data.get("date"))
#         except:
#             continue
#         if len(keys[keys_index].split(",")) > 1:
#             raw_data["uom"] = keys[keys_index].split(",")[1]
#         else:
#             raw_data["uom"] = "blank"
#         if data[keys[keys_index]][row_index] is not None:
#             raw_data["tag_value"] = float(data[keys[keys_index]][row_index])
#             # temp.append(raw_data)
#             raw_data = json.dumps(raw_data, ensure_ascii=False)
#             print(raw_data)
#             # producer.send("raw-data", value=raw_data)
#             # os.environ.get('Kafka_Topic_Raw_Data')
#         else:
#             continue

# os.remove(file_name)
