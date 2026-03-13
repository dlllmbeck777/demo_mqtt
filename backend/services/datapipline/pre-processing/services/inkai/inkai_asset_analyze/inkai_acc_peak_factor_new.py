import numpy as np
import json
import sys
from datetime import datetime
import pandas as pd

def process_data(data):
    data = json.loads(data)
    tags_to_peek = []
    timestamp = []
    for document in data:
        tags_to_peek.append(document['tag_value'])
        timestamp.append(document['time'])
        
    start_date = datetime.fromtimestamp(timestamp[0] / 1000)
    end_data =datetime.fromtimestamp(timestamp[-1] / 1000)
    start_date = pd.to_datetime(start_date)
    end_date = pd.to_datetime(end_data)
    timestamps = pd.date_range(start=start_date, end=end_date, periods=2048)
    window_start = 0
    window_end = len(tags_to_peek)

    vibration_data = np.array(tags_to_peek)
    windowed_timestamps = timestamps[window_start:window_end]

    peak_value = np.max(vibration_data)
    rms_value = np.sqrt(np.mean(vibration_data**2))
    peak_factor = peak_value / rms_value
    windowed_timestamp = [str(ts) for ts in windowed_timestamps]
    data_to_send = {
        'measurement': document['measurement'],
        'vibration_data': tags_to_peek,
        'peak_factors': peak_factor,
        'peak_value': peak_value,
        'rms_value': rms_value,
        'windowed_timestamps' : windowed_timestamp,
        'layer': document['layer'],
        'asset': document['asset'],
        'time' : document['time']
    }

    return data_to_send

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)