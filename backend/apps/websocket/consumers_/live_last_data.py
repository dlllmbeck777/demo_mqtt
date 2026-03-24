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


class WSConsumeOnlyLastData(AsyncWebsocketConsumer):
    async def _stop_task(self):
        task = getattr(self, "task", None)
        if task and not task.done():
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass

    async def send_messages(self):
        try:
            while self.is_active:
                data = retive_influx_last_data(tag_name=self.tag_name)
                if data:
                    try:
                        data["_start"] = str(
                            data["_start"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                        )
                        data["_time"] = str(
                            data["_time"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                        )
                        data["_stop"] = str(
                            data["_stop"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                        )
                        if self.is_active:
                            try:
                                await self.send(json.dumps((data)))
                            except:
                                print("HATA YAKALNDI live last data")
                                raise StopConsumer
                    except Exception as e:
                        print(str(e))
                else:
                    await self.send(json.dumps([]))
                await asyncio.sleep(int(self.times))
        except asyncio.CancelledError:
            self.is_active = False

    async def connect(self):
        await self.accept()
        self.is_active = True
        self.times = self.scope["url_route"]["kwargs"]["times"]
        self.task = None

    async def receive(self, text_data):
        try:
            tag_names = json.loads(text_data)

            self.tag_name = tag_names[0]
            await self._stop_task()
            self.task = asyncio.create_task(self.send_messages())
        except Exception as e:
            print("hata burda")
            print(str(e))
            pass

    async def disconnect(self, close_code):
        try:
            self.is_active = False
            await self._stop_task()
            print("disconnect", close_code)
        except BaseException as e:
            print(e)
