import psycopg2
import os
from connect_pg import connect_db
import time


def applyktgd(event_type):
    db_host = os.environ.get("PG_HOST")
    db_name = str(os.environ.get("LEGACY_LAYER_DB_NAME") or os.environ.get("DIAGNOSTIC_LAYER_NAME") or os.environ.get("COMPANY_NAME") or "STD").strip().lower()
    db_user = os.environ.get("PG_USER")
    db_password = os.environ.get("PG_PASS")

    connection_db = connect_db(db_host, db_name, db_user, db_password)
    cursor = connection_db[0]
    connection = connection_db[1]

    sql_query = 'SELECT "VAL21" , "VAL22", "VAL24", "id" FROM item_event_item_event WHERE "EVENT_TYPE" = %s;'
    cursor.execute(sql_query, (event_type,))
    sql_query = cursor.fetchall()

    for mtbf, mttr, mtw, id in sql_query:
        try:
            ktgd = mtbf / (mtbf + mttr + mtw)

            update_query = (
                'UPDATE item_event_item_event SET "VAL31" = %s WHERE "id" = %s'
            )
            cursor.execute(update_query, (ktgd, id))
        except Exception as error:
            continue

    connection.commit()
    cursor.close()
    connection.close()


applyktgd("COMP_READ")
applyktgd("PUMP_READ")

