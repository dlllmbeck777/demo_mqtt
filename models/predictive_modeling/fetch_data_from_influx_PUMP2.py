import json
import sys
import os
from influxdb_client import InfluxDBClient
from datetime import datetime

# InfluxDB connection details
INFLUXDB_URL = "http://influxdb1:8086"  # Replace with your actual InfluxDB container name
TOKEN = os.environ.get("INFLUX_DB_TOKEN", "CHANGE_ME_IN_ENV")
ORG = "nordal"
BUCKET = "horasan_backfill"

def query_influxdb():
    """Fetch data from InfluxDB and return it as JSON"""
    try:
        client = InfluxDBClient(url=INFLUXDB_URL, token=TOKEN, org=ORG)
        query_api = client.query_api()

        # Define the Flux query
        flux_query = f'''
        from(bucket: "{BUCKET}")
            |> range(start: -190h)
            |> filter(fn: (r) => r["_field"] == "tag_value")
            |> filter(fn: (r) => r["_measurement"] == "I_p2" or r["_measurement"] == "PUMP2/Press_P2_VB_OUT" or r["_measurement"] == "PUMP2/Temp_P2_B1_VB_OUT" or r["_measurement"] == "PUMP2/Temp_P2_B2_VB_OUT" or r["_measurement"] == "PUMP2/Temp_P2_m1_VB_OUT" or r["_measurement"] == "PUMP2/Temp_P2_m2_VB_OUT" or r["_measurement"] == "PUMP2/Temp_P2_m3_VB_OUT")
        '''

        # Execute the query
        tables = query_api.query(flux_query)
        result_data = []

        for table in tables:
            for record in table.records:
                result_data.append({
                    "_time": record.get_time().strftime("%Y-%m-%d %H:%M:%S.%f"),
                    "_measurement": record.values["_measurement"],
                    "_value": record.get_value()
                })


        # Output JSON to stdout (NiFi will capture this)
        print(json.dumps({"train_data": result_data,"execution_time": str(datetime.now())}))
        #with open('fetched_data.txt','w',encoding='utf-8') as f:
        #    json.dump({"train_data": result_data,"execution_time": str(datetime.now())},f,ensure_ascii=False,indent=4)
        #return json.dumps({"modeldata": result_data})
        #import requests
        #import json
        #url = "http://prediction_model:1478/get-prediction"
        #headers = {'Content-Type': 'application/json'}
        #response = requests.request("POST", url, headers=headers, data=json.dumps({"train_data": result_data,"execution_time": str(datetime.now())}))
        #print(response.text)


    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    query_influxdb()
