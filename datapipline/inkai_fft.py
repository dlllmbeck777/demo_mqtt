from scipy.fft import fft
from scipy.signal import welch
import json
import sys

def process_data(data):
    data = json.loads(data)
    tags_to_fft = []
    for document in data:
        frekans = document["RPM"] / 60.0  # CPM to HZ
        T = 1.0 / frekans
        fs = 1 / T  # sampling frequency

        tags_to_fft.append(document['tag_value'])

    f, pxx = welch(
        tags_to_fft,  # input data
        fs=fs,
        window="flattop",  # a flat window
        nperseg=len(tags_to_fft),  # just use one FFT the same length as the data
        scaling="spectrum"  # output the power spectrum rather than spectral density
    )

    fft_result = fft(tags_to_fft)
    fft_result_real = fft_result.real.tolist()
    fft_result_imag = fft_result.imag.tolist()

    data_to_send = {
        'measurement': document['measurement'],
        'fft_result_real': fft_result_real,
        'fft_result_imag': fft_result_imag,
        'welch_f_result': list(f),
        'welch_pxx_result': list(pxx),
        'layer': document['layer'],
        'asset': document['asset'],
        'time' : document['time']
    }

    return data_to_send

for line in sys.stdin:
    processed_data = process_data(line.strip())
    print(processed_data)