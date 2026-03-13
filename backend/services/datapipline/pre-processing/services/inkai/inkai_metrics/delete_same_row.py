import psycopg2
from datetime import datetime, timedelta
from connect_pg import connect_db
import os
import time

# ---------------------------------------------------------------------------------------- POSTGRE CONNECTION INFORMATION ----------------------------------------------------------------------------------------#

db_host = os.environ.get("PG_HOST")
db_name = "inkai"
db_user = os.environ.get("PG_USER")
db_password = os.environ.get("PG_PASS")

connection_db = connect_db(db_host, db_name, db_user, db_password)
cursor = connection_db[0]
conn = connection_db[1]


def delete_same_startdatetime(event_type):
    cursor.execute(
        'SELECT DISTINCT "ITEM_ID" FROM item_event_item_event WHERE "EVENT_TYPE" = %s',
        (event_type,),
    )
    unique_item_ids = [row[0] for row in cursor.fetchall()]
    for _ in range(45):
        for item_id in unique_item_ids:
            query = """
                SELECT id
                FROM item_event_item_event
                WHERE \"ITEM_ID\" = %s
                AND \"EVENT_TYPE\" = %s
                AND \"START_DATETIME\" IN (
                    SELECT \"START_DATETIME\"
                    FROM item_event_item_event
                    WHERE \"ITEM_ID\" = %s
                    AND \"EVENT_TYPE\" = %s
                    GROUP BY \"START_DATETIME\"
                    HAVING COUNT(*) > 1
                )
                ORDER BY \"id\"
                LIMIT 1;
                """
            cursor.execute(query, (item_id, event_type, item_id, event_type))
            ids = [row[0] for row in cursor.fetchall()]
            for id in ids:
                query = 'DELETE FROM item_event_item_event WHERE "id" = %s '
                cursor.execute(query, (id,))
                conn.commit()


delete_same_startdatetime("COMP_READ")
delete_same_startdatetime("PUMP_READ")

cursor.close()
conn.close()
