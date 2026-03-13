import threading
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import json
import time
import redis
from asgiref.sync import sync_to_async, async_to_sync
from utils.consumer_utils import find_tag, retive_last_data, retive_influx_last_data
import os
import environ
from channels.exceptions import StopConsumer

env = environ.Env(DEBUG=(bool, False))


class WSConsumeTagsStatus(AsyncWebsocketConsumer):
    async def send_messages(self):
        print("burda")
        try:
            while self.is_active:
                status = []
                for tag_name in self.tag_names:
                    data = retive_influx_last_data(tag_name=tag_name)
                    if not data:
                        status.append(tag_name)

                if self.is_active:
                    try:
                        await self.send(json.dumps((status)))
                    except:
                        print("HATA YAKALNDI live last data")
                        raise StopConsumer

                await asyncio.sleep(int(self.times))
        except asyncio.CancelledError:
            self.is_active = False

    async def connect(self):
        await self.accept()
        self.is_active = True
        self.tag_names = []
        # self.task = asyncio.create_task(self.send_messages())

    async def receive(self, text_data):
        try:
            self.tag_names = json.loads(text_data)

            self.task = asyncio.create_task(self.send_messages())
        except Exception as e:
            print("hata burda")
            print(str(e))
            pass

    async def disconnect(self, close_code):
        try:
            self.is_active = False
            self.task.cancel()
            print("disconnect", close_code)
        except BaseException as e:
            print(e)
