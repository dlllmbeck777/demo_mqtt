import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import hilbert

# Генерация синтетических данных высокочастотной вибрации
np.random.seed(0)
num_samples = 2048
time = np.linspace(0, 1, num_samples)
high_freq_vibration = 2 * np.sin(2 * np.pi * 1000 * time) + np.random.normal(
    0, 0.5, num_samples
)

# Применение преобразования Хилберта для выделения огибающей
analytic_signal = hilbert(high_freq_vibration)
envelope = np.abs(analytic_signal)

# Вычисление и вывод амплитудного спектра огибающей
frequencies = np.fft.fftfreq(num_samples, 1 / num_samples)
spectrum = np.abs(np.fft.fft(envelope))

# Визуализация результатов
plt.figure(figsize=(10, 6))

# Исходный сигнал высокочастотной вибрации
plt.subplot(3, 1, 1)
plt.plot(
    time, high_freq_vibration, label="High-Frequency Vibration Signal", color="blue"
)
plt.title("High-Frequency Vibration Signal")
plt.xlabel("Time")
plt.ylabel("Amplitude")
plt.legend()

# Огибающая
plt.subplot(3, 1, 2)
plt.plot(time, envelope, label="Envelope", color="green")
plt.title("Envelope of High-Frequency Vibration Signal")
plt.xlabel("Time")
plt.ylabel("Amplitude")
plt.legend()

# Амплитудный спектр огибающей
plt.subplot(3, 1, 3)
plt.plot(
    frequencies[: num_samples // 2],
    spectrum[: num_samples // 2],
    label="Envelope Spectrum",
    color="red",
)
plt.title("Envelope Spectrum")
plt.xlabel("Frequency (Hz)")
plt.ylabel("Amplitude")
plt.legend()

plt.tight_layout()
plt.show()
