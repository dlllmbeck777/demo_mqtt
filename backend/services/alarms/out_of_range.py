import sys
import json
import datetime
from ast import literal_eval
import time
import os
from request import getTagNameData
from send_alarm_out_of_range import send_alarm


def tag_name_check(data_tag_name, incoming_tag_name):
    min_max_values = []
    for i in range(len(incoming_tag_name)):
        if data_tag_name == incoming_tag_name[i]["NAME"]:
            min_max_values.append(incoming_tag_name[i]["LIMIT_LOLO"])
            min_max_values.append(incoming_tag_name[i]["NORMAL_MINIMUM"])
            min_max_values.append(incoming_tag_name[i]["NORMAL_MAXIMUM"])
            min_max_values.append(incoming_tag_name[i]["LIMIT_HIHI"])
            return min_max_values


# LOW << Value << max : 60, Value > max : 66, , value >> max : 67
def data_range_check(data, min_max_values):
    try:
        quality = data["payload"]["insert"][0]["vqt"][0]["q"]
        data_value = float(data["payload"]["insert"][0]["vqt"][0]["v"])
        min_min_values = float(min_max_values[0])
        min_values = float(min_max_values[1])
        max_values = float(min_max_values[2])
        max_max_values = float(min_max_values[3])
        if data_value > max_max_values:
            quality = 67
            data["gap"] = float(data_value - max_max_values)
            data["gap_type"] = "High-High"
            data["alarms_type"] = "Alarm"
            data["interval"] = f">{max_max_values}"
        elif data_value > max_values:
            quality = 66
            data["gap"] = float(data_value - max_values)
            data["gap_type"] = "High"
            data["alarms_type"] = "Alarm"
            data["interval"] = f"{max_values} - {max_max_values}"
        elif data_value > min_values:
            quality = 60
            data["gap"] = float(data_value - min_values)
            data["gap_type"] = "High"
            data["alarms_type"] = "Warning"
            data["interval"] = f"{min_values} - {max_values}"
        data["payload"]["insert"][0]["vqt"][0]["q"] = quality
    except Exception as e:
        data["payload"]["insert"][0]["fqn"] = data["payload"]["insert"][0]["fqn"]
    return data


def process_data(data):
    incoming_tag_name = getTagNameData()
    #print('Income tag name:  ',incoming_tag_name)
    data = literal_eval(data)
    sent_data_list = []
    for i in range(len(data)):
        data_range_check(data[i], tag_name_check(data[i]["payload"]["insert"][0]["fqn"], incoming_tag_name))
        data[i]["step-status"] = "out-of-range"
        try:
            new_data = {
                "measurement": data[i]["payload"]["insert"][0]["fqn"],
                "short_name": data[i]["payload"]["insert"][0]["fqn"],#["short_name"],
                "asset": data[i]["header"]["asset"],
                "layer": data[i]["header"]["layer"],
                "tag_value": data[i]["payload"]["insert"][0]["vqt"][0]["v"],
                "tag_quality": data[i]["payload"]["insert"][0]["vqt"][0]["q"],
                "time": data[i]["payload"]["insert"][0]["vqt"][0]["t"],
            }
        except:
            return (data[i]["payload"]["insert"][0]["fqn"],)
        if new_data["tag_quality"] != 192:
            gap = float("{:.3f}".format(data[i]["gap"]))
            tag_value = float("{:.3f}".format(new_data["tag_value"]))
            gap_type = data[i]["gap_type"]
            short_name = new_data["short_name"]
            alarms_type = data[i]["alarms_type"]
            interval = data[i]["interval"]
            error_message = (
                f"{short_name} ({interval}), value: {tag_value} {gap_type} : {gap} "
            )
            send_alarm(
                error_message=error_message,
                short_name=short_name,
                interval=interval,
                measurement=new_data["measurement"],
                asset=new_data["asset"],
                layer=new_data["layer"],
                tag_value=new_data["tag_value"],
                tag_quality=new_data["tag_quality"],
                alarms_type=alarms_type,
                time=new_data["time"],
                gap=gap,
                gap_type=gap_type,
                source="Out of the Range ",
            )
        sent_data_list.append(new_data)
    return sent_data_list


for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)
