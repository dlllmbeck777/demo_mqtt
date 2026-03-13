from influxdb_client import InfluxDBClient
import time
from utils.service_config import INFLUX_LIVE_BUCKET, INFLUX_ORG, INFLUX_TOKEN, INFLUX_URL


def get_value(tag_names):
    my_bucket = INFLUX_LIVE_BUCKET
    baslama_zamani = time.time()

    with InfluxDBClient(
        url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG, debug=False
    ) as client:
        query = f"""  from(bucket: "{my_bucket}")
        |> range(start: -1d)
        |> filter(fn: (r) => r["_field"] == "tag_value")

        |> filter(fn: (r) =>"""
        index = 0
        try:
            for tag_name in tag_names:
                s = f"""r["_measurement"] == "{tag_name}" """
                query += s
                if index != len(tag_names) - 1:
                    query += " or "
                index += 1
            query += ")"
            result = client.query_api().query(query)
            data = []
            for table in result:
                for record in table.records:
                    data.append(record.values)
                # Fonksiyonun bitiş zamanını kaydet

            return data
        except Exception as e:
            print(str(e))
            return []
