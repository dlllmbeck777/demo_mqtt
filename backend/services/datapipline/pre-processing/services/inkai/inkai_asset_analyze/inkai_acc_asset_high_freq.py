import numpy as np
import json
import sys
from datetime import datetime

def fft(x):
    return np.fft.fft(x)

def ifft(x):
    return np.fft.ifft(x)

def hilbert_transform(signal,num_samples):
    spectrum = fft(signal)
    spectrum[num_samples // 2 + 1 :] = 0
    hilbert_spectrum = 1j * np.sign(np.fft.fftfreq(num_samples, 1 / num_samples)) * np.abs(spectrum)
    hilbert_signal = ifft(hilbert_spectrum)
    envelope = np.abs(hilbert_signal)
    return envelope

def process_data(data):
    data = json.loads(data)
    tags_to_high_freq = []
    timestamp = []
    measurement = []
    for document in data:
        tags_to_high_freq.append(document['tag_value'])
        timestamp.append(document['time'])
        measurement.append(document['measurement'])

    
    num_samples = len(tags_to_high_freq)
    
    first_timestamp = timestamp[0]
    last_timestamp = timestamp[-1]
    first_timestamp = datetime.fromtimestamp(first_timestamp / 1000)  
    last_timestamp = datetime.fromtimestamp(last_timestamp / 1000)
    time_difference = first_timestamp - last_timestamp
    seconds_difference = time_difference.total_seconds()
    frequency = num_samples / seconds_difference
    time = np.linspace(0, seconds_difference, num_samples)
    high_freq_vibration = np.array(tags_to_high_freq)

    envelope = hilbert_transform(high_freq_vibration,num_samples)

    frequencies = np.fft.fftfreq(num_samples, 1 / frequency)
    spectrum = np.abs(fft(envelope))

    data_to_send = {
        'measurement': list(set(measurement)),
        'envelope_high_frequency': {
            'title' :  "Envelope of High-Frequency Vibration Signal",
            'time' : time.tolist(),
            'envelope' : envelope.tolist(),
        },
        'envelope_spectrum' : {
            'title' : "Envelope Spectrum",
            'frequencies' : frequencies[: num_samples // 2].tolist(),
            'spectrum'  : spectrum[: num_samples // 2].tolist(),
        },
        'layer': document['layer'],
        'asset': document['asset'],
        'time' : document['time']
    }

    return data_to_send

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)