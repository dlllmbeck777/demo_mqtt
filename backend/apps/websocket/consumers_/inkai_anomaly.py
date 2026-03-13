import datetime
import threading
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import json
import time
import redis
from asgiref.sync import sync_to_async, async_to_sync
from utils.consumer_utils import (
    find_tag,
    retive_live_data,
    retive_influx_anomaly_live_data,
)
import os
import environ
import gzip
from channels.exceptions import StopConsumer


env = environ.Env(DEBUG=(bool, False))


class WSAnomalyLiveConsumer(AsyncWebsocketConsumer):
    async def send_messages(self):
        try:
            while self.is_active:
                try:
                    data = retive_influx_anomaly_live_data(**self.kwargs)

                    if data:
                        self.kwargs["start_time"] = (
                            data[-1]["_stop"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                            if data
                            else None
                        )
                        for item in data:
                            item["_start"] = str(
                                item["_start"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                            )
                            item["_time"] = str(
                                item["_time"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                            )
                            item["_stop"] = str(
                                item["_stop"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                            )
                        if self.is_active:
                            try:
                                await self.send(json.dumps(data))
                            except Exception as e:
                                print(str(e))
                                print("HATA YAKALNDI livedata")
                                raise StopConsumer

                    await asyncio.sleep(int(self.times))
                except Exception as e:
                    print(e)
        except asyncio.CancelledError:
            self.is_active = False

    def get_predicts_obj_sync(self):
        from apps.bi_widgets.anomalys.predict import predicts

        return predicts()

    async def connect(self):
        await self.accept()
        # self.obj = predicts()
        self.start_time = int(self.scope["url_route"]["kwargs"]["start"])
        self.times = self.scope["url_route"]["kwargs"]["times"]
        self.is_active = True
        self.start_time = datetime.datetime.fromtimestamp(self.start_time).strftime(
            "%Y-%m-%dT%H:%M:%S.%fZ"
        )
        self.kwargs = {
            "start_time": str(self.start_time),
        }

    async def receive(self, text_data):
        try:
            tag_names = json.loads(text_data)
            self.kwargs["tag_names"] = tag_names
            self.task = asyncio.create_task(self.send_messages())
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
