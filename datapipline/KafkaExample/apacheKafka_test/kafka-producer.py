"""
python3 producer.py <topic> <number_of_messages>
python3 producer.py order 10
"""
import random
import string
import sys
from kafka import KafkaProducer
import json
import pandas as pd
import matplotlib.pyplot as plt

with open('D:\data_file.json') as f:
  veri = json.load(f)

def get_message():
    letters = string.ascii_uppercase
    return veri


bootstrap_servers = ['localhost:9092']
topicName = sys.argv[1]
producer = KafkaProducer(bootstrap_servers=bootstrap_servers)
for x in range(len(veri)):
    message = get_message()
    producer.send(topicName, json.dumps(message).encode('utf-8'))
    print("Sending message " + str(message))
    break

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