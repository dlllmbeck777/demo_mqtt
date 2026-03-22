import psycopg2
from datetime import datetime, timedelta
from connect_pg import connect_db
import os
import uuid

db_host = os.environ.get("PG_HOST")
db_name = str(os.environ.get("LEGACY_LAYER_DB_NAME") or os.environ.get("DIAGNOSTIC_LAYER_NAME") or os.environ.get("COMPANY_NAME") or "STD").strip().lower()
db_user = os.environ.get("PG_USER")
db_password = os.environ.get("PG_PASS")
event_type = "COMP_READ"

connection_db = connect_db(db_host, db_name, db_user, db_password)
cursor = connection_db[0]
conn = connection_db[1]

cursor.execute(
    'SELECT DISTINCT "ITEM_ID" FROM item_event_item_event WHERE "EVENT_TYPE" = %s',
    (event_type,),
)
item_ids = [row[0] for row in cursor.fetchall()]


for item_id in item_ids:
    # Take max START_DATETIME row
    cursor.execute(
        'SELECT MAX("START_DATETIME") FROM item_event_item_event WHERE "EVENT_TYPE" = %s AND "ITEM_ID" = %s',
        (event_type, item_id),
    )
    max_start_datetime = cursor.fetchone()[0]

    # Take columns
    cursor.execute(
        'SELECT * FROM item_event_item_event WHERE "EVENT_TYPE" = %s AND "ITEM_ID" = %s AND "START_DATETIME" = %s',
        (event_type, item_id, max_start_datetime),
    )
    for row in cursor.fetchall():
        event_group_id = row[1]
        period = row[4]
        val1 = row[7]
        val2 = row[8]
        val34 = row[40]
        val35 = row[41]
        char1 = row[88]
        last_updt_date = row[104]
        version = row[105]
        row_id = row[107]

    current_time = datetime.now()
    three_hours = timedelta(hours=6)
    new_current_time = current_time + three_hours

    max_start_datetime = datetime.utcfromtimestamp(max_start_datetime / 1000)

    time_difference = new_current_time - max_start_datetime

    for i in range(time_difference.days):
        if i == 0:
            continue
        new_start_datetime = max_start_datetime + timedelta(days=i)
        new_end_datetime = new_start_datetime + timedelta(days=1)

        # Insert new row
        if val2 is None:
            val2 = 0
        val1 = val1 + val2
        cursor.execute(
            'INSERT INTO item_event_item_event ("ITEM_ID", "EVENT_TYPE", "START_DATETIME", "END_DATETIME","EVENT_GROUP_ID", "PERIOD", "VAL1", "VAL2", "VAL34", "VAL35", "CHAR1", "LAST_UPDT_DATE", "VERSION", "ROW_ID") VALUES (%s, %s,  %s,  %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
            (
                item_id,
                event_type,
                new_start_datetime.timestamp() * 1000,
                new_end_datetime.timestamp() * 1000,
                event_group_id,
                period,
                val1,
                val2,
                val34,
                val35,
                char1,
                last_updt_date,
                version,
                row_id,
            ),
        )
        conn.commit()

try:
    query_select = 'SELECT "ROW_ID" FROM item_event_item_event GROUP BY "ROW_ID" HAVING COUNT(*) > 1;'
    cursor.execute(query_select)
    row_ids = cursor.fetchall()
    for row_id in row_ids:
        query_select = 'SELECT "id" FROM item_event_item_event WHERE "ROW_ID" = %s'
        cursor.execute(query_select, (row_id,))
        ids = cursor.fetchall()
        for id in ids:
            new_row_id = uuid.uuid4().hex
            sql_query = 'UPDATE item_event_item_event SET "ROW_ID" = %s WHERE "id" = %s'
            cursor.execute(sql_query, (new_row_id, id))
            conn.commit()
finally:
    cursor.close()
    conn.close()

