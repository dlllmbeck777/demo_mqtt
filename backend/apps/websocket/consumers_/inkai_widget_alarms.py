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

env = environ.Env(DEBUG=(bool, False))


class WSInkaiWidgetAlarmsConsumer(AsyncWebsocketConsumer):
    async def last_messages(self):
        try:
            while self.is_active:
                if self.is_active != False:
                    query = {
                        "layer": self.kwargs["layer"],
                        self.type: {"$in": self.value},
                    }
                    kwargs = {
                        "db_name": self.kwargs["layer"],
                        "collections": "alarms",
                        "query": query,
                    }
                    data = retrive_mongo_widget_data(**kwargs)
                    # print(data)
                    if data:
                        if self.is_active:
                            try:
                                await self.send(json.dumps((data)))
                            except:
                                print("HATA YAKALNDI widget alarms")
                                raise StopConsumer
                    else:
                        try:
                            await self.send(json.dumps(([])))
                        except:
                            print("HATA YAKALNDI widget alarms")
                            raise StopConsumer
                await asyncio.sleep(5)
        except asyncio.CancelledError:
            self.is_active = False

    async def connect(self):
        await self.accept()
        db_name = "alarms"  # os.environ["MongoDb_alarms_Name"]
        layer_name = self.scope["url_route"]["kwargs"]["layer_name"]
        self.type = self.scope["url_route"]["kwargs"]["type"]
        self.is_active = True
        self.kwargs = {"db_name": db_name, "layer": layer_name}
        self.task = None
        # self.task = asyncio.create_task(self.send_messages())

    async def receive(self, text_data):
        try:
            self.value = list(json.loads(text_data))

            if self.task is not None:
                self.task.cancel()
            self.task = asyncio.create_task(self.last_messages())
        except Exception as e:
            print(str(e))
            pass

    async def disconnect(self, close_code):
        try:
            self.is_active = False
            try:
                self.task.cancel()
            except Exception as e:
                print(str(e))
            print("disconnect", close_code)
        except BaseException as e:
            print(e)
