import psycopg2
import sys
import json
from datetime import datetime
import os

db_host = os.environ.get("PG_HOST")
db_name = "inkai"
db_user = os.environ.get("PG_USER")
db_password = os.environ.get("PG_PASS")


def connect_pg_db(db_host, db_name, db_user, db_password):
    return psycopg2.connect(
        host=db_host, database=db_name, user=db_user, password=db_password
    )


create_table_query = """
CREATE TABLE IF NOT EXISTS logs_logs (
    LOG_TYPE VARCHAR(255),
    error_message TEXT,
    layer VARCHAR(255),
    priority INT,
    source VARCHAR(255),
    category VARCHAR(255),
    state VARCHAR(255),
    "user" VARCHAR(255),
    is_read BOOLEAN,
    id VARCHAR(255),
    time BIGINT
);
"""


def time_to_datetime(data):
    return datetime.utcfromtimestamp(data)


conn = connect_pg_db(db_host, db_name, db_user, db_password)

cursor = conn.cursor()
cursor.execute(create_table_query)
conn.commit()
cursor.close()


def process_data(data):
    data = json.loads(data)

    cursor = conn.cursor()
    if data["priority"] is None:
        data["priority"] = 3

    # timestamp_datetime = time_to_datetime(data["time"])
    cursor.execute(
        """
        INSERT INTO logs_logs (LOG_TYPE, error_message, layer, priority, source, category, state, "user", is_read, id, time)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """,
        (
            data["LOG_TYPE"],
            data["error_message"],
            data["layer"],
            data["priority"],
            data["source"],
            data["category"],
            data["state"],
            data["user"],
            data["is_read"],
            data["id"],
            data["time"],
        ),
    )

    conn.commit()
    cursor.close()


for line in sys.stdin:
    process_data(line.strip())
