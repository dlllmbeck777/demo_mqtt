import numpy as np
import json
import sys
from datetime import datetime

def second_diff(time1, time2):
    first_timestamp = datetime.fromtimestamp(time1 / 1000)
    last_timestamp = datetime.fromtimestamp(time2 / 1000)
    time_difference = first_timestamp - last_timestamp
    seconds_difference = time_difference.total_seconds()
    return seconds_difference

def process_data(data):
    data = json.loads(data)
    tags_to_peek = []
    timestamp = []
    for document in data:
        tags_to_peek.append(document['tag_value'])
        timestamp.append(document['time'])

    num_samples = len(vibration_data)
    vibration_data = np.array(tags_to_peek)
    time_diff = second_diff(timestamp[0],timestamp[-1])
    frequency = num_samples // time_diff
    num_segments = int(num_samples // frequency)
    peak_factors = []
    for i in range(num_segments):
        segment = vibration_data[i * segment_length : (i + 1) * segment_length]
        peak_value = np.max(np.abs(segment))
        rms_value = np.sqrt(np.mean(segment**2))
        peak_factor = peak_value / rms_value
        peak_factors.append(peak_factor)
    
    data_to_send = {
        'measurement': document['measurement'],
        'peak_factors':  peak_factors,
        'frequencies' : list(range(1, num_segments + 1)),
        'layer': document['layer'],
        'asset': document['asset'],
        'time' : document['time']
    }

    return data_to_send

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)