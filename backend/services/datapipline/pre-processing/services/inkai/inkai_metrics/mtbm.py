import os
import psycopg2
from datetime import datetime
from connect_pg import connect_db


def applymtbm(event_type):
    db_host = os.environ.get("PG_HOST")
    db_name = "inkai"
    db_user = os.environ.get("PG_USER")
    db_password = os.environ.get("PG_PASS")

    connection_db = connect_db(db_host, db_name, db_user, db_password)

    cur = connection_db[0]
    conn = connection_db[1]

    cur.execute(
        'SELECT "ITEM_ID", "START_DATETIME" FROM item_event_item_event WHERE "EVENT_TYPE" = \'DOWNTIME\''
    )
    downtime_results = cur.fetchall()

    cur.execute(
        'SELECT "ITEM_ID", "START_DATETIME", "id" FROM item_event_item_event WHERE "EVENT_TYPE" = %s',
        (event_type,),
    )
    comp_read_results = cur.fetchall()

    downtime_count_per_year = {}
    for item_id, start_datetime in downtime_results:
        year = datetime.utcfromtimestamp(start_datetime / 1000).year
        downtime_count_per_year.setdefault(year, {}).setdefault(item_id, 0)
        downtime_count_per_year[year][item_id] += 1

    for item_id, start_datetime, id in comp_read_results:
        year = datetime.utcfromtimestamp(start_datetime / 1000).year
        downtime_count = downtime_count_per_year.get(year, {}).get(item_id, 0)
        timestamp_interval_1 = datetime(year, 1, 1, 0, 0, 0)
        start_timestamp = int(
            (timestamp_interval_1 - datetime(1970, 1, 1)).total_seconds() * 1000
        )
        timestamp_interval_2 = datetime(year, 12, 31, 0, 0, 0)
        end_datetime = int(
            (timestamp_interval_2 - datetime(1970, 1, 1)).total_seconds() * 1000
        )
        if downtime_count > 0:
            cur.execute(
                'SELECT SUM("VAL2") FROM item_event_item_event WHERE "START_DATETIME" >= %s AND "START_DATETIME" < %s AND"EVENT_TYPE" = %s AND "ITEM_ID" = %s',
                (start_timestamp, end_datetime, event_type, item_id),
            )
            total_operating_time = int(cur.fetchone()[0]) / 3600
            if total_operating_time:
                mtbf = int(total_operating_time) / int(downtime_count)
                update_query = (
                    'UPDATE item_event_item_event SET "VAL23" = %s WHERE "id" = %s'
                )
                cur.execute(update_query, (mtbf, id))
                conn.commit()

    cur.close()
    conn.close()


applymtbm("COMP_READ")
applymtbm("PUMP_READ")
