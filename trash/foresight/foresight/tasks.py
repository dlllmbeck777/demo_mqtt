from typing import Counter
from celery import shared_task
from main.models import Pump, Sensor, Prediction, Max_prediction, Station, Value
from foresight.celery import app
from pymongo import MongoClient
from bson import json_util
import json
from asgiref.sync import async_to_sync
import channels.layers
from django.conf import settings
from datetime import datetime
import random
from foresight.analytics import get_status, get_predictions
from celery.signals import celeryd_after_setup
import paho.mqtt.client as mqtt


def on_connect(client, userdata, flags, rc):  # The callback for when the client connects to the broker
    print("Connected with result code {0}".format(str(rc)))  # Print result of connection attempt
    client.subscribe("#")  # Subscribe to the topic “digitest/test1”, receive any messages published on it


def on_message(client, userdata, msg):  
    data = json.loads(msg.payload) # f - eto string iz mqtt
    new_entry = {}
    for r in data['values']:
        new_entry.update({r['id'].split('.')[-1]: [r.pop('v'),r.pop('t')]}) 
    for unit in new_entry:
        if Sensor.objects.filter(code=unit).exists():
            sensor = Sensor.objects.get(code=unit)
            value = Value.objects.create(sensor=sensor, v = new_entry[unit][0], t = new_entry[unit][1])
            value.save()
    pumps = Pump.objects.all()
    data = {}
    values = {}
    pump_statuses = {}
    for pump in pumps:
        sensors = Sensor.objects.filter(pump=pump)
        statuses = []
        for sensor in sensors: 
            temp = []
            time = []
            status = {}
            value = Value.objects.filter(sensor=sensor)
            if value.exists():
                value = value.last()
                temp.append(value.v)
                time.append(str(datetime.fromtimestamp(int(value.t/1000)).time()))
                status["id"] = sensor.code
                status["v"] = value.v
                status["q"] = value.q
                status["t"] = value.t
            values[sensor.pk] = [temp, time]
            statuses.append(status)
        pump_statuses[pump.pk] = get_status(statuses)
    data["values"] = values
    data["pump_statuses"] = pump_statuses
    broadcast_data(data)


# @celeryd_after_setup.connect
def first_task(conf=None, **kwargs):
    client = mqtt.Client("django-server")  # Create instance of client with client ID “digi_mqtt_test”
    client.on_connect = on_connect  # Define callback function for successful connection
    client.on_message = on_message  # Define callback function for receipt of a message
    # client.connect("m2m.eclipse.org", 1883, 60)  # Connect to (broker, port, keepalive-time)
    client.connect('192.168.211.19', 1883)
    client.loop_forever()  # Start networking daemon

 








@shared_task()
def get_prediction():
    pumps = Pump.objects.all()
    for pump in pumps:
        last_values = {}
        current_values = {}
        sensors = Sensor.objects.filter(pump=pump)
        for sensor in sensors: 
            temp = []
            for value in Value.objects.filter(sensor = sensor).order_by('-id').values_list('v', flat=True)[:21][::-1]:
                temp.append(value)
            if len(temp) == 21:
                current_values[sensor.code] = temp
            temp = []
            for value in Value.objects.filter(sensor = sensor).order_by('-id').values_list('v', flat=True)[21:42][::-1]:
                temp.append(value)
            if len(temp) == 21:
                last_values[sensor.code] = temp
        for l in last_values:
            print(len(last_values[l]))
        for l in current_values:
            print(len(current_values[l]))
        predictions, statuses = get_predictions(last_values, current_values)
        prediction = Prediction.objects.create(pump=pump, prediction=predictions, status=statuses)
        prediction.save()



@shared_task()
def device_result():
    pumps = Pump.objects.all()
    data = {}
    values = {}
    pump_statuses = {}
    for pump in pumps:
        sensors = Sensor.objects.filter(pump=pump)
        statuses = []
        for sensor in sensors: 
            temp = []
            time = []
            status = {}
            value = Value.objects.filter(sensor=sensor)
            if value.exists():
                value = value.last()
                temp.append(value.v)
                time.append(str(datetime.fromtimestamp(int(value.t/1000)).time()))
                status["id"] = sensor.code
                status["v"] = value.v
                status["q"] = value.q
                status["t"] = value.t
            values[sensor.pk] = [temp, time]
            statuses.append(status)
        pump_statuses[pump.pk] = get_status(statuses)
    data["values"] = values
    data["pump_statuses"] = pump_statuses
    broadcast_data(data)



def broadcast_data(data):
    channel_layer = channels.layers.get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        settings.DATA_GROUP_NAME, {
            "type": 'new_data',
            "content": json.dumps(data),
        })
