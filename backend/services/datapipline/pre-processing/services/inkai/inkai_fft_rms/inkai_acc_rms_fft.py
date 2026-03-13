import numpy as np
import json
import sys
from datetime import datetime
import math

def calculate_rms(segment):
    squares = [x ** 2 for x in segment]
    sum_of_squares = sum(squares)
    rms_value = math.sqrt(sum_of_squares / len(segment))
    return rms_value

def second_dif(time1,time2):
    first_timestamp = datetime.fromtimestamp(time1 / 1000)
    last_timestamp = datetime.fromtimestamp(time2 / 1000)
    time_difference = first_timestamp - last_timestamp
    seconds_difference = time_difference.total_seconds()
    return seconds_difference

def process_data(data):
    data = json.loads(data)
    tags_to_value = []
    timestamp = []
    for document in data:
        tags_to_value.append(document['tag_value'])
        timestamp.append(document['time'])

    vibration_data = np.array(tags_to_value)
    num_samples = len(tags_to_value)
    seconds_difference = second_dif(timestamp[0],timestamp[-1])
    frequency = len(vibration_data) / seconds_difference
    segment_length = int(frequency)


    num_segments = int(num_samples / 60)
    rms_value = []
    for i in range(num_segments):
        segment = vibration_data[i * num_segments : (i + 1) * num_segments]
        rms_value.append(calculate_rms(segment))
    
    fft_data = np.fft.fft(rms_value)
    frequencies = np.fft.fftfreq(len(fft_data), d=1/frequency)
    fft_result_real = fft_data.tolist()
    frekans_real = frequencies.tolist()
    time = np.linspace(0, seconds_difference, len(fft_result_real))
    data_to_send = {
        'measurement': document['measurement'],
        'rms_fft_time':  {
                'fft_value' : np.abs(fft_result_real).tolist(),
                'time': time.tolist(), 
        },
        'rms_fft_frequency' : {
                'fft_value' : np.abs(fft_result_real).tolist(),
                'frequencies' : np.abs(frekans_real).tolist(),
        },
        'layer': document['layer'],
        'asset': document['asset'],
        'time' : document['time']
    }

    return data_to_send

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)