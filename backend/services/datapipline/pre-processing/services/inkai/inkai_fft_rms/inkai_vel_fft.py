import numpy as np
import json
import sys
from datetime import datetime


def process_data(data):
    data = json.loads(data)
    tags_to_fft = []
    for document in data:
        tags_to_fft.append(document['tag_value'])

    frequency = document["RPM"]
    total_time = len(tags_to_fft) / frequency
    time = np.linspace(0, total_time, len(tags_to_fft))

    fft_result = np.fft.fft(tags_to_fft)
    frequencies = np.fft.fftfreq(len(fft_result), d=1/frequency)
    fft_result_real = fft_result.real.tolist()
    frequencies_real = frequencies.real.tolist()
    fft_rms = np.array(fft_result_real)
    index = [0]
    fft_result_rms = np.delete(fft_rms, index)
    rms = np.sqrt(np.mean(np.array(fft_result_rms)**2))
    data_to_send = {
        'measurement': document['measurement'],
        'fft_result_real': np.abs(fft_result_real).tolist(),
        'frequencies' : np.abs(frequencies_real).tolist(),
        'rms' : rms,
        'layer': document['layer'],
        'asset': document['asset'],
        'time' : document['time']
    }

    return data_to_send

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)