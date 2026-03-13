import numpy as np
import json
import sys
from datetime import datetime
import pandas as pd

def second_diff(time1, time2):
    first_timestamp = datetime.fromtimestamp(time1 / 1000)
    last_timestamp = datetime.fromtimestamp(time2 / 1000)
    time_difference = first_timestamp - last_timestamp
    seconds_difference = time_difference.total_seconds()
    return seconds_difference

def process_data(data):
    data = json.loads(data)
    tags_to_kurtosis = []
    timestamps = []
    for document in data:
        tags_to_kurtosis.append(document['tag_value'])
        timestamps.append(document['time'])

    vibration_acceleration = np.array(tags_to_kurtosis)
    time_diff = second_diff(timestamps[0],timestamps[-1])
    num_samples = len(tags_to_kurtosis)
    frequency = num_samples / time_diff

    start_date = timestamps[0]
    end_date = timestamps[-1]
    timestamps = pd.date_range(start=start_date, end=end_date, periods=num_samples)
    window_size = 100
    kurtosis_values = []

    for i in range(num_samples - window_size + 1):
        windowed_data = vibration_acceleration[i: i + window_size]
        mean = np.mean(windowed_data)
        variance = np.var(windowed_data)
        fourth_moment = np.mean((windowed_data - mean) ** 4)
        kurtosis_value = fourth_moment / variance ** 2 - 3
        kurtosis_values.append(kurtosis_value)

    kurtosis_value_len = len(kurtosis_values)
    frequencies = np.linspace(0, frequency, kurtosis_value_len).tolist()

    data_to_send = {
        'measurement': document['measurement'],
        'kurtosis_value': kurtosis_values,
        'frequencies': frequencies,
        'layer': document['layer'],
        'asset': document['asset'],
        'time': document['time']
    }

    return data_to_send

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)
