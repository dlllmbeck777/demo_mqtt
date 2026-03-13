import sys
import json
import datetime
from ast import literal_eval

def check_vt(string):
    if "VT" in string:
        return string
    else:
        pass

vibration_list = []

def process_data(data):
    data = literal_eval(data)
    for i in range(len(data)):
        if check_vt(data[i]["measurement"]) != None:
            vibration_list.append(data[i])
    return vibration_list

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)
