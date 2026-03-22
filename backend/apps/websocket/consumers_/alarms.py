from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import json
from pymongo import MongoClient, DESCENDING
from asgiref.sync import sync_to_async, async_to_sync
from utils.consumer_utils import find_tag, retrieve_backfill_data
import os
import datetime
import threading
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import json
import time
import redis
from asgiref.sync import sync_to_async, async_to_sync
from utils.consumer_utils import retrive_mongo_notifications
import os
import environ
import gzip
from datetime import datetime, timedelta
from channels.exceptions import StopConsumer

env = environ.Env(DEBUG=(bool, False))


class AlarmsConsumer(AsyncWebsocketConsumer):
    async def last_messages(self):
        while self.is_active:
            try:
                query = {
                    "db_name": "",
                    "layer": self.kwargs["layer"],
                    "time": {"$gt": self.kwargs["start_time"]},
                }
                kwargs = {
                    "db_name": self.kwargs["db_name"],
                    "query": query,
                }
                data = retrive_mongo_notifications(**kwargs)
                if data:
                    # print(data)
                    if self.is_active:
                        try:
                            await self.send(json.dumps((data)))
                        except:
                            print("HATA YAKALNDI")
                            raise StopConsumer

                await asyncio.sleep(15)
            except Exception as e:
                print(e)

    async def connect(self):
        await self.accept()
        db_name = "alarms"  # os.environ["MongoDb_alarms_Name"]
        layer_name = self.scope["url_route"]["kwargs"]["layer_name"]
        self.is_active = True
        self.kwargs = {"db_name": db_name, "layer": layer_name}
        # self.task = asyncio.create_task(self.send_messages())

    async def receive(self, text_data):
        try:
            get_hours = json.loads(text_data)

            current_time = datetime.now()

            one_hour_ago = current_time - timedelta(hours=int(get_hours))
            timestamp = int(one_hour_ago.timestamp())
            self.kwargs["start_time"] = timestamp
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


# class AlarmsConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()
#         db_name = "inkai_notifications"  # os.environ["MongoDb_alarms_Name"]
#         self.layer_name = self.scope["url_route"]["kwargs"]["layer_name"]
#         self.kwargs = {"db_name": db_name}
#         qs = await sync_to_async(retrieve_backfill_data)(**self.kwargs)
#         await self.send(json.dumps(qs, ensure_ascii=False))

#     async def receive(self, text_data):
#         try:
#             start_date, end_date = text_data.split(",")
#             query = {
#                 "$and": [
#                     {"layer_name": self.layer_name},
#                     {"date": {"$gte": start_date}},
#                     {"date": {"$lte": end_date}},
#                 ]
#             }
#             self.kwargs["query"] = query
#             qs = await sync_to_async(retrieve_backfill_data)(**self.kwargs)
#             await self.send(json.dumps(qs, ensure_ascii=False))
#         except BaseException as e:
#             print(e)

#     async def disconnect(self, close_code):
#         try:
#             self.client.close()
#             print("disconnect", close_code)
#         except BaseException as e:
#             print(e)
