import math
import sys
import json

def calculate_rms(data):
    squares = [x ** 2 for x in data]

    sum_of_squares = sum(squares)

    rms_value = math.sqrt(sum_of_squares / len(data))

    return rms_value

def process_data(data):
    data_list = json.loads(data)
    value_list = []
    for document in data_list:
        value_list.append(document['tag_value'])
    
    rms = calculate_rms(value_list)
    rms_data = {
        'measurement': document['measurement'],
        'rms': rms,
        'layer': document['layer'],
        'RPM': document['RPM'], 
        'asset': document['asset'],
        'time': document['time']
    }
    return rms_data

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)
