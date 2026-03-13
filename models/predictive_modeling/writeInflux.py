import sys
import json
import os
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from datetime import datetime

# InfluxDB Configuration
INFLUXDB_URL = "http://influxdb1:8086"  # Replace with your InfluxDB instance
INFLUXDB_TOKEN = os.environ.get("INFLUX_DB_TOKEN", "CHANGE_ME_IN_ENV")
ORG = "nordal"  # Organization name in InfluxDB
BUCKET = "model_prediction"  # Bucket name

# Read input from NiFi (STDIN)
input_data = sys.stdin.read().strip()

try:
    records=json.loads(input_data)
    #with open ("data_writeInflux.txt","r",encoding="utf-8") as file:
    #    records=json.load(file)
    # Initialize Client
    client = InfluxDBClient(url=INFLUXDB_URL, token=INFLUXDB_TOKEN, org=ORG)
    # Get Write API
    write_api = client.write_api(write_options=SYNCHRONOUS)

    data_points = []

    for record in records:
        print(record)
        point=(
                Point(record["tag_name"])
                .field("prediction",record["combined_prediction"])
                .tag("execution_time",record["execution_time"])
                .time(record["ds"]*1000000)
                )
        data_points.append(point)

    # Write Data to InfluxDB
    write_api.write(bucket=BUCKET, org=ORG, record=data_points)

    # Close the Client
    client.close()
    print('everything ok')
except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)
