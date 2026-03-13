from datetime import datetime
from influxdb_client import InfluxDBClient
import pandas as pd
import matplotlib.pyplot as plt
bucket = "vibration-test-bucket"
org = "nordal"

token = "JWWy8AiTrGsHBPJdYx6Fh1vnsX5J8mmeaXk4a2yDivvpN0X2lZdn7I7JkCu4tWFaefbEWS3Q-0ch8L0ogbcj2g=="
url = "http://20.230.239.209:8086"
client = InfluxDBClient(url=url, token=token, org=org)
query = f'from(bucket: "{bucket}") |> range(start: -24h) |> filter(fn:(r) => r._measurement == "OPZ_IMX.IMX001.P-2A.VT-113_P-2A")|> filter(fn:(r) => r._field == "tag_value")'
result = client.query_api().query(query, org=org)
value_list = []
time_list = []
for table in result:
    for record in table.records:
        time_stamp = record.values['_time']
        time = pd.to_datetime(time_stamp)
        value_list.append(record.values["_value"])
        time_list.append(time)

plt.plot(time_list, value_list)
plt.xlabel('Time')
plt.ylabel('Value')
plt.title('Value vs Time')
plt.xticks(rotation=45)
plt.legend(["This is my legend"], fontsize="x-large")
plt.show()