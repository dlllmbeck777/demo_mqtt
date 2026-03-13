import os
import psycopg2
from datetime import datetime
from connect_pg import connect_db


def applymttr(event_type):
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
    downtime_results = cur.fetchall()

    cur.execute(
        'SELECT "ITEM_ID", "START_DATETIME", "id" FROM item_event_item_event WHERE "EVENT_TYPE" = %s',
        (event_type,),
    )
    comp_read_results = cur.fetchall()

    downtime_count_per_year = {}
    for item_id, start_datetime, duration in downtime_results:
        if duration is not None:
            duration = int(duration)
        year = datetime.utcfromtimestamp(start_datetime / 1000).year
        downtime_count_per_year.setdefault(year, {}).setdefault(
            item_id, {"downtime_count": 0, "sum_duration": 0}
        )
        downtime_count_per_year[year][item_id]["downtime_count"] += 1
        downtime_count_per_year[year][item_id]["sum_duration"] += duration or 0

    for item_id, start_datetime, id in comp_read_results:
        year = datetime.utcfromtimestamp(start_datetime / 1000).year
        downtime_experience = downtime_count_per_year.get(year, {}).get(item_id, 0)
        if downtime_experience == 0:
            continue
        downtime_count = downtime_experience.get("downtime_count")
        total_downtime_second = downtime_experience.get("sum_duration")
        if downtime_count > 0:
            try:
                mttr = total_downtime_second / downtime_count
                update_query = (
                    'UPDATE item_event_item_event SET "VAL22" = %s WHERE "id" = %s'
                )
                cur.execute(update_query, (mttr, id))
            except:
                continue
    conn.commit()
    cur.close()
    conn.close()


applymttr("COMP_READ")
applymttr("PUMP_READ")
