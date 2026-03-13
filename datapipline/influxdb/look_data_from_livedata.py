from datetime import datetime
from influxdb_client import InfluxDBClient
import csv

bucket = "inkai_live"
org = "nordal"

token = "JWWy8AiTrGsHBPJdYx6Fh1vnsX5J8mmeaXk4a2yDivvpN0X2lZdn7I7JkCu4tWFaefbEWS3Q-0ch8L0ogbcj2g=="
url = "http://20.230.239.209:8086"
client = InfluxDBClient(url=url, token=token, org=org)
query = f'from(bucket: "{bucket}") |> range(start: -30d) |> filter(fn:(r) => r._measurement == "OPZ_IMX.IMX001.P-2A.VT-113_P-2A") |> filter(fn:(r) => r._field == "tag_value")'
result = client.query_api().query(query, org=org)
value_list = []
time_list = []  # Yeni eklenen zamanları tutacak liste

for table in result:
    for record in table.records:
        value_list.append(record.values["_value"])
        time_list.append(record.values["_time"])  # Zamanları al ve listeye ekle

# Tarih saat formatlarını ayarlayın
output_date_time_format = "%Y-%m-%d %H:%M:%S"

# `time_list` içindeki zamanları yeni bir liste olarak formatlayın
formatted_time_list = [time.strftime(output_date_time_format) for time in time_list]

# Önce verileri içerecek bir liste oluşturun (zamanları yeni formatla)
data = list(zip(formatted_time_list, value_list))

# CSV dosyasına yazmak için dosya adını belirtin
csv_filename = "veriler3.csv"

# Verileri CSV dosyasına yazın
with open(csv_filename, mode="w", newline="") as file:
    writer = csv.writer(file)
    # İlk satır başlık satırı (Zaman, Değer) olarak yazılır
    writer.writerow(["Zaman", "Değer"])
    # Verileri CSV dosyasına yaz
    writer.writerows(data)

print(f"Veriler {csv_filename} dosyasına yazıldı.")
