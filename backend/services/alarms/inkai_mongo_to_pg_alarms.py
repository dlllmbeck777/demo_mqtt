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
    conn = psycopg2.connect(
        host=db_host, database=db_name, user=db_user, password=db_password
    )
    return conn


def create_table_query():
    create_table_query = """
    CREATE TABLE IF NOT EXISTS event_event (
        LOG_TYPE VARCHAR(255),
        error_message TEXT,
        short_name TEXT,
        interval TEXT,
        layer VARCHAR(255),
        priority INT,
        source VARCHAR(255),
        measurement VARCHAR(255),
        tag_value FLOAT,
        tag_quality INT,
        gap FLOAT,
        gap_type VARCHAR(255),
        asset VARCHAR(255),
        category VARCHAR(255),
        state VARCHAR(255),
        is_read BOOLEAN,
        id VARCHAR(255),
        time BIGINT
    );
    """
    return create_table_query


def time_to_datetime(data):
    timestamp_datetime = datetime.utcfromtimestamp(data / 1000.0)
    return timestamp_datetime


conn = connect_pg_db(db_host, db_name, db_user, db_password)
create_table_query = create_table_query()

insert_query = """
INSERT INTO event_event (LOG_TYPE, error_message, short_name, interval, layer, priority, source, measurement, tag_value, tag_quality, gap, gap_type, asset, category, state, is_read, id, time)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
"""


def process_data(data):
    data = json.loads(data)

    cursor = conn.cursor()
    cursor.execute(create_table_query)
    conn.commit()

    # timestamp_datetime = time_to_datetime(data["time"])
    cursor.execute(
        insert_query,
        (
            data["LOG_TYPE"],
            data["error_message"],
            data["short_name"],
            data["interval"],
            data["layer"],
            data["priority"],
            data["source"],
            data["measurement"],
            data["tag_value"],
            data["tag_quality"],
            data["gap"],
            data["gap_type"],
            data["asset"],
            data["category"],
            data["state"],
            data["is_read"],
            data["id"],
            data["time"],
        ),
    )

    conn.commit()
    cursor.close()


for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)
