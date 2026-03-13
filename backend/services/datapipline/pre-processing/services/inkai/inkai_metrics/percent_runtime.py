import psycopg2
import os
from connect_pg import connect_db
import time

db_host = os.environ.get("PG_HOST")
db_name = "inkai"
db_user = os.environ.get("PG_USER")
db_password = os.environ.get("PG_PASS")

connection_db = connect_db(db_host, db_name, db_user, db_password)
sql_query = "SELECT * FROM item_event_item_event WHERE \"EVENT_TYPE\" = 'COMP_READ' OR \"EVENT_TYPE\" = 'PUMP_READ';"

cursor = connection_db[0]
connection = connection_db[1]
cursor.execute(sql_query)
records = cursor.fetchall()
print(len(records))
for row in records:
    try:
        val2 = min(int(row[8]) / 3600, 24)
        val26 = (val2 / 24) * 100
        update_query = 'UPDATE item_event_item_event SET "VAL26" = %s WHERE "id" = %s;'
        cursor.execute(update_query, (val26, row[0]))
        connection.commit()
    except Exception as error:
        continue

cursor.close()
connection.close()
