import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import kurtosis, skew

# Generate synthetic vibration acceleration data with timestamps for X, Y, Z axes
np.random.seed(0)
num_samples = 1000  # Number of data points
start_date = pd.to_datetime("2023-01-01")
end_date = pd.to_datetime("2023-01-02")
timestamps = pd.date_range(start=start_date, end=end_date, periods=num_samples)

# Generate data for X, Y, Z axes
acceleration_x = np.random.randn(num_samples)
acceleration_y = np.random.randn(num_samples)
acceleration_z = np.random.randn(num_samples)

# Create a DataFrame with timestamps and acceleration data
data = pd.DataFrame(
    {
        "Timestamp": timestamps,
        "Acceleration_X": acceleration_x,
        "Acceleration_Y": acceleration_y,
        "Acceleration_Z": acceleration_z,
    }
)

# Calculate kurtosis and skewness for each axis
kurtosis_x = kurtosis(data["Acceleration_X"])
kurtosis_y = kurtosis(data["Acceleration_Y"])
kurtosis_z = kurtosis(data["Acceleration_Z"])

skewness_x = skew(data["Acceleration_X"])
skewness_y = skew(data["Acceleration_Y"])
skewness_z = skew(data["Acceleration_Z"])


# Interpret kurtosis values
def interpret_kurtosis(kurtosis_value):
    if kurtosis_value < 3:
        return "Healthy (Ek < 3) - исправное состояние"
    elif kurtosis_value < 5:
        return "Operable (Ek > 3) - допустима эксплуатация"
    else:
        return "Unacceptable (Ek < 5) - недопустима эксплуатация"


interpretation_x = interpret_kurtosis(kurtosis_x)
interpretation_y = interpret_kurtosis(kurtosis_y)
interpretation_z = interpret_kurtosis(kurtosis_z)

print(f"Kurtosis X: {kurtosis_x:.2f} - {interpretation_x}")
print(f"Kurtosis Y: {kurtosis_y:.2f} - {interpretation_y}")
print(f"Kurtosis Z: {kurtosis_z:.2f} - {interpretation_z}")

# Plot distribution of signal values for each axis
plt.figure(figsize=(12, 10))

plt.subplot(3, 2, 1)
plt.hist(data["Acceleration_X"], bins=20, color="blue", alpha=0.7)
plt.title("Distribution of Acceleration X")
plt.xlabel("Acceleration Value")
plt.ylabel("Frequency")

plt.subplot(3, 2, 2)
plt.hist(data["Acceleration_Y"], bins=20, color="green", alpha=0.7)
plt.title("Distribution of Acceleration Y")
plt.xlabel("Acceleration Value")
plt.ylabel("Frequency")

plt.subplot(3, 2, 3)
plt.hist(data["Acceleration_Z"], bins=20, color="red", alpha=0.7)
plt.title("Distribution of Acceleration Z")
plt.xlabel("Acceleration Value")
plt.ylabel("Frequency")

plt.subplot(3, 2, 4)
plt.bar(
    ["Kurtosis X", "Kurtosis Y", "Kurtosis Z"],
    [kurtosis_x, kurtosis_y, kurtosis_z],
    color=["blue", "green", "red"],
)
plt.title("Kurtosis Values")
plt.ylabel("Kurtosis")

plt.subplot(3, 2, 5)
plt.bar(
    ["Skewness X", "Skewness Y", "Skewness Z"],
    [skewness_x, skewness_y, skewness_z],
    color=["blue", "green", "red"],
)
plt.title("Skewness Values")
plt.ylabel("Skewness")

plt.tight_layout()
plt.show()
