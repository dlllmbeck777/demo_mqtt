import psycopg2
from datetime import datetime, timedelta
from connect_pg import connect_db
import os
import uuid

db_host = os.environ.get("PG_HOST")
db_name = "inkai"
db_user = os.environ.get("PG_USER")
db_password = os.environ.get("PG_PASS")

connection_db = connect_db(db_host, db_name, db_user, db_password)
cursor = connection_db[0]
conn = connection_db[1]

try:
    # Tablonuz ve ROW_ID sütununuzun adını güncelleyin

    row_id_column = "row_id"

    # Tüm ROW_ID'leri seçin
    query_select = 'SELECT "ROW_ID" FROM item_event_item_event GROUP BY "ROW_ID" HAVING COUNT(*) > 1;'
    cursor.execute(query_select)
    row_ids = cursor.fetchall()

    # Aynı değere sahip ROW_ID'leri güncelle
    for row_id in row_ids:
        query_select = 'SELECT "id" FROM item_event_item_event WHERE "ROW_ID" = %s'
        cursor.execute(query_select, (row_id,))
        ids = cursor.fetchall()
        for id in ids:
            print(id)
            new_row_id = uuid.uuid4().hex
            sql_query = 'UPDATE item_event_item_event SET "ROW_ID" = %s WHERE "id" = %s'
            cursor.execute(sql_query, (new_row_id, id))
            conn.commit()

except Exception as e:
    print(f"Hata: {e}")

finally:
    # Bağlantıyı kapat
    cursor.close()
    conn.close()
