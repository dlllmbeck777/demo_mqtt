import numpy as np
import json
import sys
from datetime import datetime


def process_data(data):
    data = json.loads(data)
    tags_to_wavefrom = []
    for document in data:
        tags_to_wavefrom.append(document['tag_value'])

    frequency = document["RPM"]
    total_time = len(tags_to_wavefrom) / frequency
    time = np.linspace(0, total_time, len(tags_to_wavefrom))
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