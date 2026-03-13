import psycopg2
import os
from connect_pg import connect_db
import time


def applyktgm(event_type):
    db_host = os.environ.get("PG_HOST")
    db_name = "inkai"
    db_user = os.environ.get("PG_USER")
    db_password = os.environ.get("PG_PASS")

    connection_db = connect_db(db_host, db_name, db_user, db_password)
    cursor = connection_db[0]
    connection = connection_db[1]

    sql_query = 'SELECT "VAL21", "VAL22", "id" FROM item_event_item_event WHERE "EVENT_TYPE" = %s;'
    cursor.execute(sql_query, (event_type,))
    sql_query = cursor.fetchall()

    for mtbf, mttr, id in sql_query:
        try:
            ktgm = mtbf / (mtbf + mttr)
            update_query = (
                'UPDATE item_event_item_event SET "VAL30" = %s WHERE "id" = %s'
            )
            cursor.execute(update_query, (ktgm, id))
        except Exception as error:
            continue

    connection.commit()
    cursor.close()
    connection.close()


applyktgm("COMP_READ")
applyktgm("COMP_READ")
