import datetime
import threading
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import json
import time
import redis
from asgiref.sync import sync_to_async, async_to_sync
from utils.consumer_utils import retrive_last_mongo_warnings
import os
import environ
import gzip
from datetime import datetime, timedelta
from channels.exceptions import StopConsumer

env = environ.Env(DEBUG=(bool, False))


class WSInkaiLastWarningsConsumer(AsyncWebsocketConsumer):
    async def last_messages(self):
        try:
            while self.is_active:
                try:
                    query = {"layer": self.kwargs["layer"], "source": "MQTT-Broker"}
                    kwargs = {
                        "db_name": self.kwargs["layer"],
                        "collections": "warnings",
                        "query": query,
                    }
                    data = retrive_last_mongo_warnings(**kwargs)
                    # print(data)
                    if data:
                        if self.is_active:
                            try:
                                await self.send(json.dumps((data)))

                            except:
                                print("HATA YAKALNDI, connect status")
                                self.is_active = False
                                raise StopConsumer

                    await asyncio.sleep(1)
                except Exception as e:
                    print(e)

        except asyncio.CancelledError:
            self.is_active = False

    async def connect(self):
        await self.accept()
        db_name = "warnings"  # os.environ["MongoDb_alarms_Name"]
        layer_name = self.scope["url_route"]["kwargs"]["layer_name"]
        self.is_active = True
        self.kwargs = {"db_name": db_name, "layer": layer_name}
        self.task = None
        self.task = asyncio.create_task(self.last_messages())

    async def receive(self, text_data):
        pass
        # try:
        #     self.get_hours = json.loads(text_data)
        #     if self.task is not None:
        #         self.task.cancel()
        #     self.task = asyncio.create_task(self.last_messages())
        # except Exception as e:
        #     print(str(e))
        #     pass

    async def disconnect(self, close_code):
        try:
            self.is_active = False
            self.task.cancel()
            print("disconnect", close_code)
        except BaseException as e:
            print(e)
