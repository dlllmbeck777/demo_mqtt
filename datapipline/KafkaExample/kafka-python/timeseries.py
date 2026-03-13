import pandas as pd
import matplotlib.pyplot as plt

discoveries = pd.read_json('C:\data_file.json')

discoveries['date1'] = pd.to_datetime(discoveries.date1)

# Set the date column as the index of your DataFrame discoveries
discoveries = discoveries.set_index('date1')
ax = discoveries.plot()
# Specify the x-axis label in your plot
ax.set_xlabel('date1')

# Specify the y-axis label in your plot
ax.set_ylabel('Values')
plt.show()