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
# code ,status , priority
downtime = 'SELECT "START_DATETIME", "END_DATETIME", "VAL1", "id", "CHAR1"  FROM item_event_item_event WHERE "EVENT_TYPE" = \'DOWNTIME\''
cursor.execute(downtime)
downtime_values = cursor.fetchall()

for start, end, duration_second, id, code in downtime_values:
    if duration_second is not None:
        start_datetime = datetime.utcfromtimestamp(start / 1000)
        new_end_datetime = (
            start_datetime + timedelta(hours=int(duration_second / 3600))
        ).timestamp() * 1000
        print("----------------------")
        print(start_datetime)
        print(duration_second / 3600)
        print(new_end_datetime)
        print("----------------------")
        if (
            code == "L4-DO-P-MI_PUM_P1"
            or code == "L4-DO-P-MI_COM_P2"
            or code == "L4-DO-P-MI_COM_P3"
            or code == "L4-DO-P-MI_COM_P1"
            or code == "L4-DO-P-MI_COM_P4"
        ):
            update_query = 'UPDATE item_event_item_event SET "END_DATETIME" = %s, "CHAR12" = \'RESOLVED\', "CHAR19" = \'MEDIUM\' WHERE "id" = %s'
            cursor.execute(update_query, (new_end_datetime, id))
            conn.commit()
        else:
            update_query = 'UPDATE item_event_item_event SET "END_DATETIME" = %s, "CHAR12" = \'RESOLVED\', "CHAR19" = \'HIGH\' WHERE "id" = %s'
            cursor.execute(update_query, (new_end_datetime, id))
            conn.commit()

cursor.close()
conn.close()

