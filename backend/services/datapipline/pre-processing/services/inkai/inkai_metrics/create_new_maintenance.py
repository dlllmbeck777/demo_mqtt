import psycopg2
from datetime import datetime, timedelta
from connect_pg import connect_db
import os
import uuid
import random

db_host = os.environ.get("PG_HOST")
db_name = str(os.environ.get("LEGACY_LAYER_DB_NAME") or os.environ.get("DIAGNOSTIC_LAYER_NAME") or os.environ.get("COMPANY_NAME") or "STD").strip().lower()
db_user = os.environ.get("PG_USER")
db_password = os.environ.get("PG_PASS")

connection_db = connect_db(db_host, db_name, db_user, db_password)
cursor = connection_db[0]
conn = connection_db[1]


# To create new maintenance
def create_new_column(hours_diff, item_id, char1, char2, current_time, start_datetime):
    start_datetime = datetime.utcfromtimestamp(start_datetime / 1000)
    new_start_datetime = start_datetime + timedelta(hours=hours_diff)
    new_end_datetime = new_start_datetime + timedelta(hours=hours_diff + 3)
    char11 = False
    val1 = 3 * 60 * 60
    char1 = char1
    char2 = char2
    char17 = random.randint(1, 15000)
    event_type = "DOWNTIME"
    event_group_id = " "
    period = "EVENT"
    last_updt_date = current_time
    version = uuid.uuid4().hex
    row_id = uuid.uuid4().hex
    cursor.execute(
        'INSERT INTO item_event_item_event ("ITEM_ID", "EVENT_GROUP_ID", "EVENT_TYPE", "PERIOD", "LAST_UPDT_DATE", "VERSION", "ROW_ID", "START_DATETIME", "END_DATETIME", "CHAR11", "VAL1", "CHAR1", "CHAR2", "CHAR17") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
        (
            item_id,
            event_group_id,
            event_type,
            period,
            last_updt_date.timestamp(),
            version,
            row_id,
            new_start_datetime.timestamp() * 1000,
            new_end_datetime.timestamp() * 1000,
            char11,
            val1,
            char1,
            char2,
            char17,
        ),
    )
    conn.commit()


# To find the difference between START_DATETIME and the current time
def time_calc(start_datetime):
    current_time = datetime.now()
    three_hours = timedelta(hours=6)  # +6 hours to adjust to KZ time
    new_current_time = current_time + three_hours
    start_datetime = datetime.utcfromtimestamp(start_datetime / 1000)
    time_difference = new_current_time - start_datetime
    total_hours = time_difference.total_seconds() / 3600
    return total_hours


# Postgre query to get ITEM_ID's uniquely.
def postgre_query(event_type):
    db_host = os.environ.get("PG_HOST")
    db_name = str(os.environ.get("LEGACY_LAYER_DB_NAME") or os.environ.get("DIAGNOSTIC_LAYER_NAME") or os.environ.get("COMPANY_NAME") or "STD").strip().lower()
    db_user = os.environ.get("PG_USER")
    db_password = os.environ.get("PG_PASS")

    connection_db = connect_db(db_host, db_name, db_user, db_password)
    cursor = connection_db[0]
    conn = connection_db[1]

    sql_query = (
        'SELECT DISTINCT "ITEM_ID" FROM item_event_item_event WHERE "EVENT_TYPE" = %s'
    )
    cursor.execute(sql_query, (event_type,))
    item_ids = [result[0] for result in cursor.fetchall()]
    return item_ids


# ---------------------------------------------------------------------------------------- COMP_READ ----------------------------------------------------------------------------------------#

item_ids = postgre_query("COMP_READ")

# Check for all ITEM_ID's
for item_id in item_ids:
    sql_query = f'SELECT MAX("START_DATETIME") FROM item_event_item_event WHERE "ITEM_ID" = \'{item_id}\' AND "CHAR1" = \'L4-DO-P-MI_COM_P1\''
    cursor.execute(sql_query)
    max_start_datetime = cursor.fetchone()[0]
    total_hours_diff = time_calc(max_start_datetime)
    if total_hours_diff >= 4000:
        create_new_column(
            4000,
            item_id,
            "L4-DO-P-MI_COM_P1",
            "Scheduled maintenance 4000",
            datetime.now(),
            max_start_datetime,
        )

    sql_query = f'SELECT MAX("START_DATETIME") FROM item_event_item_event WHERE "ITEM_ID" = \'{item_id}\' AND "CHAR1" = \'L4-DO-P-MI_COM_P2\''
    cursor.execute(sql_query)
    max_start_datetime = cursor.fetchone()[0]
    total_hours_diff = time_calc(max_start_datetime)

    if total_hours_diff >= 8000:
        create_new_column(
            8000,
            item_id,
            "L4-DO-P-MI_COM_P2",
            "Scheduled maintenance 8000",
            datetime.now(),
            max_start_datetime,
        )

    sql_query = f'SELECT MAX("START_DATETIME") FROM item_event_item_event WHERE "ITEM_ID" = \'{item_id}\' AND "CHAR1" = \'L4-DO-P-MI_COM_P4\''
    cursor.execute(sql_query)
    max_start_datetime = cursor.fetchone()[0]
    total_hours_diff = time_calc(max_start_datetime)

    if total_hours_diff >= 12000:
        create_new_column(
            12000,
            item_id,
            "L4-DO-P-MI_COM_P4",
            "Scheduled repairs",
            datetime.now(),
            max_start_datetime,
        )

    sql_query = f'SELECT MAX("START_DATETIME") FROM item_event_item_event WHERE "ITEM_ID" = \'{item_id}\' AND "CHAR1" = \'L4-DO-P-MI_COM_P3\''
    cursor.execute(sql_query)
    max_start_datetime = cursor.fetchone()[0]
    total_hours_diff = time_calc(max_start_datetime)

    if total_hours_diff >= 16000:
        create_new_column(
            16000,
            item_id,
            "L4-DO-P-MI_COM_P3",
            "Major renovation",
            datetime.now(),
            max_start_datetime,
        )

# ---------------------------------------------------------------------------------------- PUMP_READ ----------------------------------------------------------------------------------------#
item_ids = postgre_query("PUMP_READ")

for item_id in item_ids:
    sql_query = f'SELECT MAX("START_DATETIME") FROM item_event_item_event WHERE "ITEM_ID" = \'{item_id}\' AND "CHAR1" = \'L4-DO-P-MI_PUM_P1\''
    cursor.execute(sql_query)
    max_start_datetime = cursor.fetchone()[0]
    total_hours_diff = time_calc(max_start_datetime)
    if total_hours_diff >= 180:
        create_new_column(
            180,
            item_id,
            "L4-DO-P-MI_PUM_P1",
            "Scheduled maintenance",
            datetime.now(),
            max_start_datetime,
        )


cursor.close()
conn.close()

