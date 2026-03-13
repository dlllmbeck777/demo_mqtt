import numpy as np
import matplotlib.pyplot as plt

# Constants
sampling_rate = 1 / 5  # Sampling rate (1 sample every 5 seconds)
duration = 2048 * 5  # Duration of data collection (2048 samples * 5 seconds per sample)
num_samples = 2048  # Number of samples
pump_rpm = 1450  # Pump RPM

# Generate synthetic vibration acceleration data (example)
time = np.linspace(0, duration, num_samples)
vibration_data = (
    0.1 * np.sin(2 * np.pi * 1 * time)
    + 0.2 * np.sin(2 * np.pi * 2 * time)  # 1 Hz component
    + 0.05 * np.sin(2 * np.pi * 10 * time)  # 2 Hz component  # 10 Hz component
)

# Calculate the corresponding frequencies for FFT
frequencies = np.fft.fftfreq(num_samples, 1 / sampling_rate)

# Compute the FFT of the vibration data
spectrum = np.abs(np.fft.fft(vibration_data))

# Plot the spectrum (frequency domain)
plt.figure(figsize=(10, 4))
plt.plot(
    frequencies[: num_samples // 2],
    spectrum[: num_samples // 2],
    label="Spectrum",
    color="blue",
)
plt.title("Frequency Spectrum of Vibration Acceleration Data")
plt.xlabel("Frequency (Hz)")
plt.ylabel("Amplitude")
plt.legend()
plt.grid(True)
plt.show()
