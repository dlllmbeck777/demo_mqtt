import psycopg2
from datetime import datetime
from statistics import mean
from connect_pg import connect_db
import os


def applykg(event_type):
    db_host = os.environ.get("PG_HOST")
    db_name = str(os.environ.get("LEGACY_LAYER_DB_NAME") or os.environ.get("DIAGNOSTIC_LAYER_NAME") or os.environ.get("COMPANY_NAME") or "STD").strip().lower()
    db_user = os.environ.get("PG_USER")
    db_password = os.environ.get("PG_PASS")

    connection_db = connect_db(db_host, db_name, db_user, db_password)
    cursor = connection_db[0]
    conn = connection_db[1]

    cursor.execute(
        'SELECT "ITEM_ID", "START_DATETIME", "VAL1" FROM item_event_item_event WHERE "EVENT_TYPE" = \'DOWNTIME\''
    )
    downtime_results = cursor.fetchall()

    cursor.execute(
        'SELECT "ITEM_ID", "START_DATETIME", "VAL21", "id" FROM item_event_item_event WHERE "EVENT_TYPE" = %s',
        (event_type,),
    )
    comp_read_results = cursor.fetchall()

    downtime_count_per_year = {}
    average_maintenance_duration_per_year = {}

    for item_id, start_datetime, val1 in downtime_results:
        year = datetime.utcfromtimestamp(start_datetime / 1000).year
        downtime_count_per_year.setdefault(year, {}).setdefault(item_id, 0)
        downtime_count_per_year[year][item_id] += 1
        average_maintenance_duration_per_year.setdefault(year, [])
        average_maintenance_duration_per_year[year].append(val1)

    for year, val1_list in average_maintenance_duration_per_year.items():
        try:
            val1_list = [value for value in val1_list if value is not None]
            if val1_list:
                average_maintenance_duration_per_year[year] = mean(val1_list)
            average_maintenance_duration_per_year[year] = mean(val1_list)
        except Exception as e:
            continue

    for item_id, start_datetime, mtbf, id in comp_read_results:
        try:
            year = datetime.utcfromtimestamp(start_datetime / 1000).year
            average_maintenance_duration = average_maintenance_duration_per_year.get(
                year, 0
            )
            kg = mtbf / (mtbf + average_maintenance_duration)
            cursor.execute(
                'UPDATE item_event_item_event SET "VAL29" = %s WHERE "id" = %s ',
                (kg, id),
            )
        except Exception as e:
            continue

    conn.commit()
    cursor.close()
    conn.close()


applykg("COMP_READ")
applykg("PUMP_READ")

