import psycopg2
import pandas as pd
import sys, json, datetime, time, os
from ast import literal_eval
from send_alarm_out_of_range import send_alarm
import datetime
import pytz


# Connection details
conn = psycopg2.connect(
    host="ligeiaai-postgres-1",
    port="5432",
    database="horasan",
    user="postgres",
    password="manager"
)

# Query the table
df = pd.read_sql("SELECT * FROM modelresults_ranges", conn)

# Close connection
conn.close()

# Display dataframe
#print(df.head())


def process_data(data1):
    data = json.loads(data1)#literal_eval(data1)
    for i in range(len(data)):

        tag_name = data[i]['tag_name']

        df_v2 = df.loc[df['tag_name']==tag_name]

        tag_limit_low = int(df_v2['limit_low'][0])
        tag_limit_high = int(df_v2['limit_high'][0])
        

        if data[i]["tag_name"]==tag_name and data[i]["prediction"]>tag_limit_low and data[i]["prediction"]<tag_limit_high:
            data[i]["sendtofront"]="yes"
        else:
            data[i]["sendtofront"]="no"
        data[i]["step-status"] = "out-of-range"
        


        # --------- 2025 03 17 -------- insert to kafka if anomaly -------
        if data[i]["sendtofront"]=="yes":
            send_alarm(
                    error_message=f"Sensor {data[i]['tag_name']} will have anomaly at time {pytz.utc.localize(datetime.datetime.fromtimestamp(data[i]['ds']/1000)).astimezone(pytz.timezone('Asia/Tashkent'))}.",
                    #short_name = data[i]["tag_name"],
                    #interval = str(df_v2['interval'][0]),
                    #measurement = str(df_v2["measurement"][0]),
                    asset = str(df_v2['asset'][0]),
                    layer = str(df_v2['layer'][0]),
                    category = 'alarms',#str(df_v2['category'][0]),
                    #tag_value =str( data[i]["combined_prediction"]),
                    #tag_quality = str(df_v2['tag_quality'][0]),
                    #alarms_type = "Alarm",
                    time = data[i]["ds"]
                    #gap = str(df_v2['gap'][0]),
                    #gap_type = str(df_v2['gap_type'][0]),
                    #source = str(df_v2['source'][0]), #"Out of the Range "
                )
            print('Sended: ',data[i]["tag_name"])
    return data1

for line in sys.stdin:
    processed_data = process_data(line.strip())
#    print(processed_data)

#print('starting')
#procdata=[{"prediction":49.02831260580279,"ds":1731621776000,"execution_time":"2023-12-05 12:00:00","tag_name":"PUMP1/Temp_P1_B1_VB_OUT"},{"prediction":10.02827471105745,"ds":1731621777000,"execution_time":"2023-12-05 12:00:00","tag_name":"PUMP1/Temp_P1_B1_VB_OUT"},{"prediction":77.02824017794222,"ds":1731621778000,"execution_time":"2023-12-05 12:00:00","tag_name":"PUMP1/Temp_P1_B1_VB_OUT"}]
#procdata2=[{"ds":1745043744000,"execution_time":"2025-04-19 06:27:14.787723","prediction":44.19203571295371,"tag_name":"PUMP1/Temp_P1_B1_VB_OUT"},{"ds":1745043749000,"execution_time":"2025-04-19 06:27:14.787723","prediction":44.193442774988185,"tag_name":"PUMP1/Temp_P1_B1_VB_OUT"},{"ds":1745043754000,"execution_time":"2025-04-19 06:27:14.787723","prediction":44.194849924185974,"tag_name":"PUMP1/Temp_P1_B1_VB_OUT"}]
#with open("send_anomalies_tofront1","r") as file:
#    procdata3=file.read()

#processed_data=process_data(procdata3)
#print('finished')




