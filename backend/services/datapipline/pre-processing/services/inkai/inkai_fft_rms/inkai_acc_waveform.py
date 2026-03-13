import numpy as np
import json
import sys
from datetime import datetime


def process_data(data):
    data = json.loads(data)
    tags_to_wavefrom = []
    timestamp = []

    for document in data:
        tags_to_wavefrom.append(document['tag_value'])
        timestamp.append(document['time'])
    num_samples = len(tags_to_wavefrom)
    
    first_timestamp = timestamp[0]
    last_timestamp = timestamp[-1]
    first_timestamp = datetime.fromtimestamp(first_timestamp / 1000)  # Saniyeye dönüştür
    last_timestamp = datetime.fromtimestamp(last_timestamp / 1000)
    time_difference = first_timestamp - last_timestamp
    seconds_difference = time_difference.total_seconds()

    time = np.linspace(0, seconds_difference, num_samples)
    rms = np.sqrt(np.mean(np.array(tags_to_wavefrom)**2))

    data_to_send = {
        'measurement': document['measurement'],
        'waveform_data': tags_to_wavefrom,
        'time_interval' : time.tolist(),
        'rms' : rms,
        'layer': document['layer'],
        'asset': document['asset'],
        'time' : document['time']
    }

    return data_to_send

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)