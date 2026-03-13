import sys
import json
import datetime
from ast import literal_eval
import time
import os
from send_alarm_out_of_range import send_alarm

def process_data(data1):
    data = data1#literal_eval(data1)
    for i in range(len(data)):
        if data[i]["tag_name"]=="PUMP4/Temp_P4_B1_VB_OUT" and data[i]["combined_prediction"]>40 :
            data[i]["sendtofront"]="yes"
        elif data[i]["tag_name"]=="PUMP4/Temp_P4_B1_VB_OUT" and data[i]["combined_prediction"]<=40 :
            data[i]["sendtofront"]="no"
        data[i]["step-status"] = "out-of-range"

        # --------- 2025 03 17 -------- insert to kafka if anomaly -------
        if data[i]["sendtofront"]=="yes":
            send_alarm(
                    error_message=f"Sensor {data[i]['tag_name']} will have anomaly at time {data[i]['ds']}.",
                    short_name=data[i]["tag_name"],
                    interval="12.0 - 78.0",
                    measurement=data[i]["tag_name"],
                    asset="OpenPCS7",
                    layer="Horasan",
                    tag_value=data[i]["combined_prediction"],
                    tag_quality=192,
                    alarms_type="Alarm",
                    time=data[i]["ds"],
                    gap=1.6,
                    gap_type="Low",
                    source="Out of the Range ",
                )
    return data1

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)

#print('starting')
#procdata=[{"combined_prediction":49.02831260580279,"ds":1731621776000,"execution_time":"2023-12-05 12:00:00","tag_name":"PUMP1/Temp_P1_B1_VB_OUT"},{"combined_prediction":49.02827471105745,"ds":1731621777000,"execution_time":"2023-12-05 12:00:00","tag_name":"PUMP1/Temp_P1_B1_VB_OUT"},{"combined_prediction":49.02824017794222,"ds":1731621778000,"execution_time":"2023-12-05 12:00:00","tag_name":"PUMP1/Temp_P1_B1_VB_OUT"}]
#processed_data=process_data(procdata)
#print('finished')
