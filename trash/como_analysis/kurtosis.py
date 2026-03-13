import numpy as np
import pandas as pd
from scipy.stats import kurtosis
import matplotlib.pyplot as plt
import seaborn as sns

# Generate synthetic time-series vibration acceleration data with random datetime timestamps
np.random.seed(0)
num_samples = 1000  # Number of data points
start_date = pd.to_datetime("2023-01-01")
end_date = pd.to_datetime("2023-01-02")
timestamps = pd.date_range(start=start_date, end=end_date, periods=num_samples)
vibration_acceleration = np.random.randn(num_samples)  # Replace with your actual data

# Calculate kurtosis values for a moving window
window_size = 100  # Adjust the window size as needed
kurtosis_values = []

for i in range(num_samples - window_size + 1):
    windowed_data = vibration_acceleration[i : i + window_size]
    kurtosis_value = kurtosis(windowed_data)
    kurtosis_values.append(kurtosis_value)

# Create a DataFrame for visualization
data_df = pd.DataFrame(
    {"Timestamp": timestamps[window_size - 1 :], "Kurtosis": kurtosis_values}
)

# Create subplots with different visualization options
fig, axs = plt.subplots(3, 2, figsize=(14, 10))

# Visualization Option 1: Line Chart (Default)
axs[0, 0].plot(
    data_df["Timestamp"],
    data_df["Kurtosis"],
    label="Line Chart (Default)",
    color="blue",
)
axs[0, 0].set_title("Kurtosis Analysis (Line Chart)")
axs[0, 0].set_xlabel("Timestamp")
axs[0, 0].set_ylabel("Kurtosis Value")
axs[0, 0].legend()

# Visualization Option 2: Bar Chart
axs[0, 1].bar(
    data_df["Timestamp"], data_df["Kurtosis"], label="Bar Chart", color="green"
)
axs[0, 1].set_title("Kurtosis Analysis (Bar Chart)")
axs[0, 1].set_xlabel("Timestamp")
axs[0, 1].set_ylabel("Kurtosis Value")
axs[0, 1].legend()

# Visualization Option 3: Histogram
axs[1, 0].hist(data_df["Kurtosis"], bins=20, label="Histogram", color="orange")
axs[1, 0].set_title("Kurtosis Analysis (Histogram)")
axs[1, 0].set_xlabel("Kurtosis Value")
axs[1, 0].set_ylabel("Frequency")
axs[1, 0].legend()

# Visualization Option 4: Box Plot
sns.boxplot(data=data_df, y="Kurtosis", ax=axs[1, 1], color="purple")
axs[1, 1].set_title("Kurtosis Analysis (Box Plot)")
axs[1, 1].set_ylabel("Kurtosis Value")
axs[1, 1].legend()

# Visualization Option 5: Violin Plot
sns.violinplot(data=data_df, y="Kurtosis", ax=axs[2, 0], color="red")
axs[2, 0].set_title("Kurtosis Analysis (Violin Plot)")
axs[2, 0].set_xlabel("Kurtosis Value")
axs[2, 0].set_ylabel("Kurtosis Value")
axs[2, 0].legend()

# Remove the unused subplot
fig.delaxes(axs[2, 1])

# Adjust layout and display the plots
plt.tight_layout()
plt.show()
