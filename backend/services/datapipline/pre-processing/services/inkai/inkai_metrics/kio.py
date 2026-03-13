import psycopg2
import os
from connect_pg import connect_db
import time
from datetime import datetime

db_host = os.environ.get("PG_HOST")
db_name = "inkai"
db_user = os.environ.get("PG_USER")
db_password = os.environ.get("PG_PASS")

connection_db = connect_db(db_host, db_name, db_user, db_password)
cursor = connection_db[0]
connection = connection_db[1]

sql_query = 'SELECT "START_DATETIME" ,"id" FROM item_event_item_event WHERE "EVENT_TYPE" = \'COMP_READ\' OR "EVENT_TYPE" = \'PUMP_READ\';'

cursor.execute(sql_query)
sql_query = cursor.fetchall()

for start_datetime, id in sql_query:
    end_timestamp = datetime.utcfromtimestamp(start_datetime / 1000)
    first_day_of_the_year = datetime(end_timestamp.year, 1, 1)
    first_day_of_the_year_timestamp = int(first_day_of_the_year.timestamp() * 1000)
    end_timestamp = start_datetime
    sql_query = 'SELECT SUM("VAL2") FROM item_event_item_event WHERE "START_DATETIME" < %s and "START_DATETIME" > %s'
    cursor.execute(sql_query, (end_timestamp, first_day_of_the_year_timestamp))
    sql_query = cursor.fetchall()
    for sum_runtime in sql_query:
        if sum_runtime[0]:
            kio = int((sum_runtime[0] / 3600)) / 360 * 24
            update_query = (
                'UPDATE item_event_item_event SET "VAL28" = %s WHERE "id" = %s'
            )
            cursor.execute(update_query, (kio, id))
            connection.commit()

cursor.close()
connection.close()
