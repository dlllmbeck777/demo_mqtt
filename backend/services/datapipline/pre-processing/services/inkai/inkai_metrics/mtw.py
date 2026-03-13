import os
import psycopg2
from datetime import datetime
from connect_pg import connect_db


def applymtw(event_type):
    db_host = os.environ.get("PG_HOST")
    db_name = "inkai"
    db_user = os.environ.get("PG_USER")
    db_password = os.environ.get("PG_PASS")

    connection_db = connect_db(db_host, db_name, db_user, db_password)
    cur = connection_db[0]
    conn = connection_db[1]

    cur.execute(
        'SELECT "ITEM_ID", "START_DATETIME", "VAL1" FROM item_event_item_event WHERE "EVENT_TYPE" = \'DOWNTIME\''
    )
    downtime_records = cur.fetchall()

    cur.execute(
        'SELECT "ITEM_ID", "START_DATETIME", "id" FROM item_event_item_event WHERE "EVENT_TYPE" = %s',
        (event_type,),
    )
    comp_read_records = cur.fetchall()

    downtime_counts = {}

    for record in downtime_records:
        item_id, start_datetime, duration_second = record
        start_datetime = datetime.utcfromtimestamp(start_datetime / 1000)
        year = start_datetime.year
        downtime_counts.setdefault(year, {}).setdefault(item_id, 0)
        downtime_counts[year][item_id] += 1

    for record in comp_read_records:
        item_id, start_datetime, id = record
        start_datetime = datetime.utcfromtimestamp(start_datetime / 1000)
        year = start_datetime.year
        if year in downtime_counts and item_id in downtime_counts[year]:
            downtime_count = downtime_counts[year][item_id]
            if duration_second != 0:
                try:
                    mtw = duration_second / downtime_count
                    update_query = (
                        'UPDATE item_event_item_event SET "VAL24" = %s WHERE "id" = %s'
                    )
                    cur.execute(update_query, (mtw, id))
                    conn.commit()
                except Exception as error:
                    continue
    cur.close()
    conn.close()


applymtw("COMP_READ")
applymtw("PUMP_READ")
