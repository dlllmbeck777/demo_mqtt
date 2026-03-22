import datetime
import threading
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import json
import time
import redis
from asgiref.sync import sync_to_async, async_to_sync
from utils.consumer_utils import retrive_mongo_notifications, retrive_mongo_widget_data
import os
import environ
import gzip
from datetime import datetime, timedelta
from channels.exceptions import StopConsumer
from autobahn.exception import Disconnected

env = environ.Env(DEBUG=(bool, False))


class WSInkaiAlarmsConsumer(AsyncWebsocketConsumer):
    async def async_send_function(self, data):
        try:
            await self.send(json.dumps(data))
        except Disconnected:
            self.is_active = False
            self.task.cancel()
            await self.close()

    async def last_messages(self):
        try:
            while self.is_active:
                try:
                    query = {
                        "layer": self.kwargs["layer"],
                    }
                    if self.types == "asset":
                        query[self.types] = {"$in": self.value}
                    kwargs = {
                        "db_name": self.kwargs["layer"],
                        "collections": "alarms",
                        "query": query,
                    }

                    data = retrive_mongo_widget_data(**kwargs)
                    if data:
                        await self.async_send_function(data)
                    else:
                        await self.async_send_function([])
                    await asyncio.sleep(15)
                except Exception as e:
                    print(e)
        except asyncio.CancelledError:
            self.is_active = False

    async def connect(self):
        await self.accept()
        db_name = "alarms"  # os.environ["MongoDb_alarms_Name"]
        layer_name = self.scope["url_route"]["kwargs"]["layer_name"]
        self.types = self.scope["url_route"]["kwargs"]["types"]
        self.is_active = True
        self.kwargs = {"db_name": db_name, "layer": layer_name}
        self.task = None
        if self.types == "all":
            self.task = asyncio.create_task(self.last_messages())

    async def receive(self, text_data):
        try:
            self.value = json.loads(text_data)
            print(self.value)
            if self.task is not None:
                self.task.cancel()
            self.task = asyncio.create_task(self.last_messages())
        except Exception as e:
            print(str(e))
        pass

    async def disconnect(self, close_code):
        try:
            self.is_active = False
            self.task.cancel()
            print("disconnect", close_code)
        except BaseException as e:
            print(e)
