import os
import psycopg2
from datetime import datetime
from connect_pg import connect_db


def applymttm(event_type):
    db_host = os.environ.get("PG_HOST")
    db_name = str(os.environ.get("LEGACY_LAYER_DB_NAME") or os.environ.get("DIAGNOSTIC_LAYER_NAME") or os.environ.get("COMPANY_NAME") or "STD").strip().lower()
    db_user = os.environ.get("PG_USER")
    db_password = os.environ.get("PG_PASS")

    connection_db = connect_db(db_host, db_name, db_user, db_password)
    cur = connection_db[0]
    conn = connection_db[1]

    cur.execute(
        'SELECT "ITEM_ID", "START_DATETIME" FROM item_event_item_event WHERE "EVENT_TYPE" = \'DOWNTIME\''
    )
    downtime_records = cur.fetchall()

    cur.execute(
        'SELECT "ITEM_ID", "START_DATETIME","id" FROM item_event_item_event WHERE "EVENT_TYPE" = %s',
        (event_type,),
    )
    comp_read_records = cur.fetchall()

    downtime_counts = {}

    for record in downtime_records:
        item_id, start_datetime = record
        start_datetime = datetime.utcfromtimestamp(start_datetime / 1000)
        year = start_datetime.year
        downtime_counts.setdefault(year, {}).setdefault(item_id, 0)
        downtime_counts[year][item_id] += 1

    for record in comp_read_records:
        item_id, start_datetime, id = record
        start_datetime = datetime.utcfromtimestamp(start_datetime / 1000)
        year = start_datetime.year
        timestamp_interval_1 = datetime(year, 1, 1, 0, 0, 0)
        start_timestamp = int(
            (timestamp_interval_1 - datetime(1970, 1, 1)).total_seconds() * 1000
        )
        timestamp_interval_2 = datetime(year, 12, 31, 0, 0, 0)
        end_datetime = int(
            (timestamp_interval_2 - datetime(1970, 1, 1)).total_seconds() * 1000
        )
        if year in downtime_counts and item_id in downtime_counts[year]:
            downtime_count = downtime_counts[year][item_id]
            cur.execute(
                'SELECT SUM("VAL2") FROM item_event_item_event WHERE "START_DATETIME" >= %s AND "START_DATETIME" < %s AND"EVENT_TYPE" = %s AND "ITEM_ID" = %s',
                (start_timestamp, end_datetime, event_type, item_id),
            )
            total_operating_time = cur.fetchone()[0]
            if total_operating_time != 0:
                try:
                    mttm = total_operating_time / downtime_count
                    update_query = (
                        'UPDATE item_event_item_event SET "VAL25" = %s WHERE "id" = %s'
                    )
                    cur.execute(update_query, (mttm, id))
                except Exception as error:
                    continue
    conn.commit()
    cur.close()
    conn.close()


applymttm("COMP_READ")
applymttm("PUMP_READ")

