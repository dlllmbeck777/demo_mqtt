import redis
import json
import csv
import time as timelibrary
import os
# INKAI
header = ['asset','tag_value','tag_name','createdTime','timestamp']
Redis_Db_Name = os.environ.get("Redis_Db_Name")
rds = redis.StrictRedis(Redis_Db_Name, port=6379, db=2)
mget_filters = ["version=1"]
converted_list = []
data = []
length = len(rds.keys())

mget_reply = rds.ts().mget(mget_filters, with_labels=True)

for i in range(length- 150):
    keys = mget_reply[i].keys()
    converted_list.append(list(keys))

with open('test.csv','a',newline='') as csvfile:
    my_writer = csv.writer(csvfile)
    my_writer.writerow(header)

for i in range(length - 150):
    index = str(converted_list[i])
    index = index.strip('[]')
    index = index.strip(''' ' ' ''')
    # print(mget_reply[i])
    print(mget_reply[i][index][0]['asset'])
    data.append([mget_reply[i][index][0]['asset'],mget_reply[i][index][0]['tag_value'],mget_reply[i][index][0]['tag_name'],mget_reply[i][index][0]['createdTime'],mget_reply[i][index][0]['timestamp']])
    
    for i in range(len(data)):
        with open('test.csv', 'a',newline='') as f:
            my_f = csv.writer(f)
            my_f.writerow(data[i])
    data.clear()

    

# with open ("my_file.json", mode="a") as file:
#     file.write(json.dumps(mget_reply, indent=4) + "\n") 

#  {
#         "P85C_stat_b:1683748233317": [
#             {
#                 "completion": "P-85C",
#                 "version": "1",
#                 "createdTime": "2023-05-10 19:50:41.935186",
#                 "message_type": "inkai-live-data",
#                 "layer": "Inkai",
#                 "asset": "P-85C",
#                 "timestamp": "1683748233317",
#                 "quality": "192",
#                 "tag_value": "19756.0",
#                 "tag_name": "P85C_stat_b"
#             },
#             1683748233317,
#             19756.0
#         ]
#     },