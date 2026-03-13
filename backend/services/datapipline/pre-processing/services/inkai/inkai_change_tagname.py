import sys
from kafka import KafkaConsumer, TopicPartition
from kafka import KafkaProducer
import json
import datetime
from ast import literal_eval
import time

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
    bootstrap_servers="broker:29092",
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
        dbname="horasan",
        user="postgres",
        password="manager",
        host="192.168.1.88",  # or your database server's IP address
        port="5434"  # default PostgreSQL port
    )

    # Create a cursor object
    cur = conn.cursor()

    #cur.execute("SELECT 1")

    # Fetch the result
    #result = cur.fetchone()

    #if result:
    #    print("Successfully connected to the database!")

    # Define the SQL INSERT statement
    sql = '''INSERT INTO tmp_test777_insert_test_row_random select now(), '{}'::text'''.format(str(row))
    sql_test = '''insert into tmp_test777_insert_test_row_random select now(), 'xxx777'::text'''
    # Execute the SQL statement with the data
    cur.execute(sql)

    # Commit the transaction to make the changes persistent
    conn.commit()

    # Close the cursor and connection
    cur.close()
    conn.close()

    #print("Row inserted successfully!")

    return row

#insert_to_db('xxx')

for line in sys.stdin:
#    print('Line: ',line)
    processed_data = insert_to_db(line.strip())
    print(processed_data)

    
