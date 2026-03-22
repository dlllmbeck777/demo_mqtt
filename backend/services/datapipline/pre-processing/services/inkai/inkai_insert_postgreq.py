import sys
from kafka import KafkaConsumer, TopicPartition
from kafka import KafkaProducer
import json
import datetime
from ast import literal_eval
import time
import os

KAFKA_BOOTSTRAP_SERVERS = os.environ.get(
    "KAFKA_BOOTSTRAP_SERVERS",
    os.environ.get("Kafka_Host_DP", os.environ.get("Kafka_Host", "broker:29092")),
)
LEGACY_LAYER_NAME = str(
    os.environ.get("LEGACY_LAYER_NAME")
    or os.environ.get("DIAGNOSTIC_LAYER_NAME")
    or os.environ.get("COMPANY_NAME")
    or "STD"
).strip()
LEGACY_LAYER_DB_NAME = os.environ.get(
    "LEGACY_LAYER_DB_NAME",
    os.environ.get("DIAGNOSTIC_LAYER_NAME", os.environ.get("COMPANY_NAME", "STD")),
)
PG_USER = os.environ.get("PG_USER", "postgres")
PG_PASS = os.environ.get("PG_PASS", "manager")
PG_HOST = os.environ.get("PG_HOST", "localhost")
PG_PORT = os.environ.get("PG_EXPOSE_PORT", os.environ.get("PG_PORT", "5434"))

def tag_name_check(data_tag_name, incoming_tag_name):
    min_max_values = []
    for i in range(len(incoming_tag_name)):
        if data_tag_name == incoming_tag_name[i]["NAME"]:
            min_max_values.append(incoming_tag_name[i]["NORMAL_MINIMUM"])
            min_max_values.append(incoming_tag_name[i]["NORMAL_MAXIMUM"])
            return min_max_values


def data_range_check(data, min_max_values):
    # try:
    quality = data["payload"]["insert"][0]["vqt"][0]["q"]
    data_value = float(data["payload"]["insert"][0]["vqt"][0]["v"])
    min_values = 50.0  # float(min_max_values[0])
    max_values = 100.0  # float(min_max_values[1])
    print(max_values)
    print(min_values)
    if data_value < min_values:
        quality = quality - 127
    elif data_value > max_values:
        quality = quality - 126
    data["payload"]["insert"][0]["vqt"][0]["q"] = quality
    # except:
    #     data["payload"]["insert"][0]["fqn"] = "no such tag value found"
    return data

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode('ascii'),
)
sent_data_list = []
def process_data(data):
    # r = requests.get(req)
    # incoming_tag_name = r.json()
    data = literal_eval(data)
    for i in range(len(data)):
        # df2 = dict(data)
        # if data["payload"]["insert"][0]["vqt"][0]["q"] == 192:
        #     data_range_check(data, tag_name_check(data["payload"]["insert"][0]["fqn"], incoming_tag_name))
        # key = data["header"]["asset"].encode("utf-8")
        # del data["step-status"]
        data[i]["step-status"] = "out-of-range"
        new_data = {
            "measurement": data[i]["payload"]["insert"][0]["fqn"],
            "layer": data[i]["header"]["layer"],
            "tag_value": data[i]["payload"]["insert"][0]["vqt"][0]["v"],
            "tag_quality": data[i]["payload"]["insert"][0]["vqt"][0]["q"],
            "time" : data[i]["payload"]["insert"][0]["vqt"][0]["t"],
        }
        sent_data_list.append(new_data)
    return sent_data_list


def insert_to_db(row):
    import psycopg2

    # Connect to your PostgreSQL database
    conn = psycopg2.connect(
        dbname=LEGACY_LAYER_DB_NAME,
        user=PG_USER,
        password=PG_PASS,
        host=PG_HOST,
        port=PG_PORT
    )

    # Create a cursor object
    cur = conn.cursor()

    #cur.execute("SELECT 1")

    # Fetch the result
    #result = cur.fetchone()

    #if result:
    #    print("Successfully connected to the database!")

    # Define the SQL INSERT statement
    sql = '''INSERT INTO tmp_test777_insert_test_row select now(), '{}'::text'''.format(str(row))
    sql_test = '''insert into tmp_test777_insert_test_row select now(), 'xxx777'::text'''
    # Execute the SQL statement with the data
    cur.execute(sql)

    # Commit the transaction to make the changes persistent
    conn.commit()

    # Close the cursor and connection
    cur.close()
    conn.close()

    #print("Row inserted successfully!")

    return row

def select_from_db():
    import psycopg2
    from datetime import datetime, timedelta, timezone
    import time
    import pandas as pd

    # Get the current datetime
    now = datetime.now()

    # Convert the current datetime to seconds since the Unix epoch
    epoch_seconds = int(time.mktime(now.timetuple()))

    today_epoch = epoch_seconds
    
    # Connect to your PostgreSQL database
    conn = psycopg2.connect(
        dbname=LEGACY_LAYER_DB_NAME,
        user=PG_USER,
        password=PG_PASS,
        host=PG_HOST,
        port=PG_PORT
    )

    # Create a cursor object
    cur = conn.cursor()

    # query
    query = "select measurement,short_name,asset,layer,tag_value,tag_quality,inserted from change_widgets_timerange_v2"

    # Execute the query
    cur.execute(query)

    # Fetch all results from the executed query
    results = cur.fetchall()

    dict_res = {
        'measurement': 'AI_BigDATA/BIG_DATA_VT1_P1_2'
        ,'short_name': 'AI_BigDATA/BIG_DATA_VT1_P1_2'
        ,'asset': 'OpenPCS7'
        ,'layer': LEGACY_LAYER_NAME
        ,'tag_value': 1.10164535
        ,'tag_quality': 192
        ,'time': 1725201202094
        }
    
    list_res = []
    
    for result in results:
        dict_res = {
            'measurement':str(result[0])
            ,'short_name':str(result[1])
            ,'asset':str(result[2])
            ,'layer':str(result[3])
            ,'tag_value':str(result[4])
            ,'tag_quality':str(result[5])
            ,'time':str(today_epoch * 1000)
            }
        #now = datetime.now()
        res_datetime = pd.to_datetime(result[6]).replace(tzinfo=timezone.utc)

        # Calculate the threshold (2 days ago from now)
        two_days_ago = pd.to_datetime(now - timedelta(days=2)).replace(tzinfo=timezone.utc)
        #print(res_datetime,' ',type(res_datetime))
        # Perform action if some_datetime is within the last 2 days
        if res_datetime >= two_days_ago:
            list_res.append(dict_res)
    print(list_res)

    #for row in results:
    #    list_res.append(row)
    #    print('QQQ: ',row)

    return list_res

select_from_db()

#for line in sys.stdin:
#    res2 = select_from_db()
#    print(res2)
    
#insert_to_db('xxx')

#for line in sys.stdin:
#    print('Line: ',line)
#    processed_data = insert_to_db(line.strip())
#    print(processed_data)

    

