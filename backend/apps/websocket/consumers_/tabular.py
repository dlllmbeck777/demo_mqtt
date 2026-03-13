import threading
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import json
import time
import redis
from asgiref.sync import sync_to_async, async_to_sync
from utils.consumer_utils import find_tag, retive_live_data
import os
import environ
from channels.exceptions import StopConsumer

env = environ.Env(DEBUG=(bool, False))


class WSLiveTabularConsumer(AsyncWebsocketConsumer):
    async def send_messages(self):
        try:
            while self.is_active:
                # print(self.offset)
                query_tuple = retive_live_data(**self.kwargs)
                self.kwargs["start_time"], self.kwargs["end_time"], *data = query_tuple
                if data:
                    new_data = data[0][self.offset :]
                    self.offset = self.offset + len(new_data)
                    new_list = []
                    for item in new_data:
                        new_list.append(list(item.values())[0][0])
                    if self.is_active:
                        try:
                            await self.send(json.dumps(new_list, ensure_ascii=False))
                        except:
                            print("HATA YAKALNDI tabular")
                            raise StopConsumer

                await asyncio.sleep(int(self.times))
        except asyncio.CancelledError:
            self.is_active = False

    async def connect(self):
        await self.accept()
        redis_host = env("REDIS_TS_HOST")
        self.rds = redis.StrictRedis(redis_host, port=6379, db=2)
        self.tag_id = self.scope["url_route"]["kwargs"]["tag_id"]
        self.start_time = self.scope["url_route"]["kwargs"]["start"]
        self.times = self.scope["url_route"]["kwargs"]["times"]
        self.offset = int(self.scope["url_route"]["kwargs"]["offset"])
        self.is_active = True
        tag_name = await sync_to_async(find_tag)(self.tag_id)
        self.kwargs = {
            "tag_name": tag_name,
            "redis": self.rds.ts(),
            "start_time": str(int(self.start_time) + 1),
            "withlabes": True,
        }
        self.task = asyncio.create_task(self.send_messages())

    async def receive(self, text_data):
        try:
            start_time, end_time = text_data.split(",")
            self.kwargs["start_time"] = start_time
            self.kwargs["end_time"] = end_time
        except:
            pass

    async def disconnect(self, close_code):
        try:
            self.is_active = False
            self.task.cancel()
            self.rds.connection_pool.disconnect()
            print("disconnect", close_code)
        except BaseException as e:
            print(e)
