import redis
import json
import os

Redis_Db_Name = os.environ.get("Redis_Db_Name")
rds = redis.StrictRedis(Redis_Db_Name, port=6379, db=6)
# Create Kafka Consumer
mget_filters = ["tag_value=67.9000015"]

mget_reply = rds.ts().mget(mget_filters, with_labels=True)
a = json.dumps(mget_reply, indent=4) + "\n"
print(json.dumps(mget_reply, indent=4) + "\n")
with open('deneme.json', "w") as f:
    f.write(a)