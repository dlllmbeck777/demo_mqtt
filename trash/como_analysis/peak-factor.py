import numpy as np
import pandas as pd
from scipy.signal import butter, lfilter
import matplotlib.pyplot as plt

# Generate synthetic time-series vibration data with random datetime timestamps
np.random.seed(0)
num_samples = 1700000  # Number of data points
start_date = pd.to_datetime("2023-01-01")
end_date = pd.to_datetime("2023-01-30")
timestamps = pd.date_range(start=start_date, end=end_date, periods=num_samples)
vibration_data = np.random.randn(num_samples)  # Replace with your actual data

# Define the desired sampling rate (e.g., 1 Hz)
desired_sampling_rate = 1  # Hz

# Resample the data to the desired sampling rate
resampled_data = (
    pd.Series(vibration_data, index=timestamps)
    .resample(pd.Timedelta(seconds=1 / desired_sampling_rate))
    .mean()
    .interpolate()
)

# Define the time window parameters (start and end indices)
# You can adjust these values based on your data and analysis needs
window_start = 20
window_end = 400  # Assuming a 400-second window for this example

# Extract the portion of data within the specified time window
windowed_data = resampled_data[window_start:window_end]
windowed_timestamps = windowed_data.index


# Apply a low-pass filter (Butterworth filter) to reduce noise
def butter_lowpass(cutoff, fs, order=5):
    nyquist = 0.5 * fs
    normal_cutoff = cutoff / nyquist
    b, a = butter(order, normal_cutoff, btype="low", analog=False)
    return b, a


def butter_lowpass_filter(data, cutoff, fs, order=5):
    b, a = butter_lowpass(cutoff, fs, order=order)
    y = lfilter(b, a, data)
    return y


# Define filter parameters
cutoff_frequency = 0.1  # Adjust the cutoff frequency as needed
filtered_data = butter_lowpass_filter(
    windowed_data, cutoff_frequency, desired_sampling_rate
)

# Calculate RMS and peak values
rms_value = np.sqrt(np.mean(filtered_data**2))
peak_value = np.max(filtered_data)

# Create a plot for the filtered time window
plt.figure(figsize=(10, 6))
plt.plot(
    windowed_timestamps, filtered_data, label="Filtered Time Window", color="green"
)
plt.axhline(
    y=rms_value, color="red", linestyle="--", label=f"RMS Value: {rms_value:.2f}"
)
plt.axhline(
    y=peak_value, color="blue", linestyle="--", label=f"Peak Value: {peak_value:.2f}"
)
plt.title("Filtered Time Window with RMS and Peak Values")
plt.xlabel("Timestamp")
plt.ylabel("Amplitude")
plt.legend()

# Display the plot
plt.tight_layout()
plt.show()
