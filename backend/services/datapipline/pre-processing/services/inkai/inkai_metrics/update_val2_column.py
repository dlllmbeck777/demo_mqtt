import psycopg2
from datetime import datetime, timedelta
from connect_pg import connect_db
import os

# PostgreSQL bağlantı bilgileri
db_host = os.environ.get("PG_HOST")
db_name = str(os.environ.get("LEGACY_LAYER_DB_NAME") or os.environ.get("DIAGNOSTIC_LAYER_NAME") or os.environ.get("COMPANY_NAME") or "STD").strip().lower()
db_user = os.environ.get("PG_USER")
db_password = os.environ.get("PG_PASS")

connection_db = connect_db(db_host, db_name, db_user, db_password)
cursor = connection_db[0]
conn = connection_db[1]

cursor.execute(
    'SELECT DISTINCT "ITEM_ID" FROM item_event_item_event WHERE "EVENT_TYPE" = \'PUMP_READ\';'
)
item_ids = [row[0] for row in cursor.fetchall()]

for item_id in item_ids:
    comp_read_query = 'SELECT "START_DATETIME", "VAL2", "id" FROM item_event_item_event WHERE "EVENT_TYPE" = \'PUMP_READ\' AND "ITEM_ID" = %s'
    cursor.execute(comp_read_query, (item_id,))
    comp_read_values = cursor.fetchall()

    for start_datetime, val2, id in comp_read_values:
        print(id)
        downtime_query = 'SELECT "VAL1"  FROM item_event_item_event WHERE "EVENT_TYPE" = \'DOWNTIME\' AND "START_DATETIME" = %s AND "ITEM_ID" = %s '
        cursor.execute(downtime_query, (start_datetime, item_id))
        downtime_value = cursor.fetchone()
        if downtime_value:
            try:
                run_time = val2 - downtime_value[0]
                if run_time < 0:
                    run_time = 0
            except:
                continue
        else:
            continue
        update_query = 'UPDATE item_event_item_event SET "VAL2" = %s WHERE "id" = %s'
        cursor.execute(update_query, (run_time, id))
        conn.commit()

cursor.close()
conn.close()

