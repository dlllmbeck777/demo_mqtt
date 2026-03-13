import numpy as np
import json
import sys
from datetime import datetime

def second_diff(time1,time2):
    first_timestamp = datetime.fromtimestamp(time1 / 1000)
    last_timestamp = datetime.fromtimestamp(time2 / 1000)
    time_difference = first_timestamp - last_timestamp
    seconds_difference = time_difference.total_seconds()
    return seconds_difference

def process_data(data):
    data = json.loads(data)
    tags_to_auto_spectrum = []
    timestamp = []
    for document in data:
        tags_to_auto_spectrum.append(document['tag_value'])
        timestamp.append(document['time'])
    time_diff = second_diff(timestamp[0],timestamp[-1])
    num_samples = len(tags_to_auto_spectrum)
    frequency = num_samples / time_diff

    vibration_data = tags_to_auto_spectrum
    spectrum = np.abs(np.fft.fft(vibration_data))
    frequencies = np.fft.fftfreq(len(spectrum), d=1/frequency)

    data_to_send = {
        'measurement': document['measurement'],
        'spectrum':  spectrum[: num_samples // 2].tolist(),
        'frequencies' : frequencies[: num_samples // 2].tolist(),
        'layer': document['layer'],
        'asset': document['asset'],
        'time' : document['time']
    }

    return data_to_send

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)