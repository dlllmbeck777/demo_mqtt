import psycopg2
from datetime import datetime, timedelta
from connect_pg import connect_db
import os

# ---------------------------------------------------------------------------------------- POSTGRE CONNECTION INFORMATION ----------------------------------------------------------------------------------------#

db_host = os.environ.get("PG_HOST")
db_name = str(os.environ.get("LEGACY_LAYER_DB_NAME") or os.environ.get("DIAGNOSTIC_LAYER_NAME") or os.environ.get("COMPANY_NAME") or "STD").strip().lower()
db_user = os.environ.get("PG_USER")
db_password = os.environ.get("PG_PASS")
event_type = "PUMP_READ"

connection_db = connect_db(db_host, db_name, db_user, db_password)
cursor = connection_db[0]
conn = connection_db[1]


# Postgre query for rows to update.
def postgre_query(event_type):
    sql_query = 'SELECT "START_DATETIME", "id"FROM item_event_item_event WHERE "EVENT_TYPE" = %s AND "CHAR1" = \'PUMPING\''
    cursor.execute(sql_query, (event_type,))
    sql_query = cursor.fetchall()
    return sql_query


# ---------------------------------------------------------------------------------------- PUMP_READ ----------------------------------------------------------------------------------------#

sql_query = postgre_query("PUMP_READ")

for start_datetime, id in sql_query:
    start_datetime = datetime.utcfromtimestamp(start_datetime / 1000)
    date2 = ((start_datetime + timedelta(hours=168)).timestamp() * 1000,)

    sql_query = 'UPDATE item_event_item_event SET "DATE2" = %s WHERE "id" = %s '
    cursor.execute(sql_query, (date2, id))
    conn.commit()

# ---------------------------------------------------------------------------------------- COMP_READ ----------------------------------------------------------------------------------------#

sql_query = postgre_query("COMP_READ")

for start_datetime, id in sql_query:
    start_datetime = datetime.utcfromtimestamp(start_datetime / 1000)
    date2 = ((start_datetime + timedelta(hours=4000)).timestamp() * 1000,)
    date3 = ((start_datetime + timedelta(hours=8000)).timestamp() * 1000,)
    date4 = ((start_datetime + timedelta(hours=24000)).timestamp() * 1000,)
    date5 = ((start_datetime + timedelta(hours=16000)).timestamp() * 1000,)

    sql_query = 'UPDATE item_event_item_event SET "DATE2" = %s, "DATE3" = %s, "DATE4" = %s, "DATE5" = %s WHERE "id" = %s'
    cursor.execute(sql_query, (date2, date3, date4, date5, id))
    conn.commit()

cursor.close()
conn.close()

