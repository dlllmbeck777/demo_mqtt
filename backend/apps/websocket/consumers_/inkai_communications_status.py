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


class WSInkaiCommunicationsConsumer(AsyncWebsocketConsumer):
    async def last_messages(self):
        try:
            while self.is_active:
                try:
                    query = {"layer": self.kwargs["layer"]}
                    kwargs = {
                        "db_name": self.kwargs["layer"],
                        "collections": "warnings",
                        "query": query,
                    }
                    data = retrive_mongo_notifications(**kwargs)
                    if data:
                        if self.is_active:
                            try:
                                # print()
                                await self.send(json.dumps((data)))
                            except:
                                print("HATA YAKALNDI inkai cominications status")
                                raise StopConsumer

                    await asyncio.sleep(15)
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
        self.task = asyncio.create_task(self.last_messages())
        # self.task = asyncio.create_task(self.send_messages())

    async def receive(self, text_data):
        pass
        # try:
        #     get_hours = json.loads(text_data)

        #     current_time = datetime.now()

        #     one_hour_ago = current_time - timedelta(hours=int(get_hours))
        #     timestamp = int(one_hour_ago.timestamp())
        #     self.kwargs["start_time"] = timestamp
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


# class WSInkaiNotificationsConsumer(AsyncWebsocketConsumer):
#     # async def first_messages(self):
#     #     while self.is_active:
#     #         try:
#     #             data = retrive_notifications(**self.kwargs)
#     #             for item in data:
#     #                 item["_start"] = str(
#     #                     item["_start"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
#     #                 )
#     #                 item["_time"] = str(item["_time"].strftime("%Y-%m-%dT%H:%M:%S.%fZ"))
#     #                 item["_stop"] = str(item["_stop"].strftime("%Y-%m-%dT%H:%M:%S.%fZ"))
#     #             if data:
#     #                 self.start_time = data[-1]["_stop"]
#     #             await self.send(json.dumps(data))
#     #             self.is_active = False

#     #         except Exception as e:
#     #             print(e)

#     async def last_messages(self):
#         while self.is_active:
#             try:
#                 data = retrive_live_notifications(**self.kwargs)
#                 # print(self.kwargs["start_time"])
#                 if data:
#                     self.kwargs["start_time"] = (
#                         data[-1]["_stop"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
#                         if data
#                         else None
#                     )
#                     for item in data:
#                         item["_start"] = str(
#                             item["_start"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
#                         )
#                         item["_time"] = str(
#                             item["_time"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
#                         )
#                         item["_stop"] = str(
#                             item["_stop"].strftime("%Y-%m-%dT%H:%M:%S.%fZ")
#                         )
#                     await self.send(json.dumps((data)))

#                 await asyncio.sleep(5)
#             except Exception as e:
#                 print(e)

#     async def connect(self):
#         await self.accept()
#         self.category = str(self.scope["url_route"]["kwargs"]["category"])
#         self.start_time = ""
#         self.is_active = True
#         self.kwargs = {"category": self.category}
#         # self.task = asyncio.create_task(self.send_messages())

#     async def receive(self, text_data):
#         try:
#             get_hours = json.loads(text_data)
#             self.kwargs["start_time"] = f"-{int(get_hours)}h"
#             self.task = asyncio.create_task(self.last_messages())
#         except Exception as e:
#             print(str(e))
#             pass

#     async def disconnect(self, close_code):
#         try:
#             self.is_active = False
#             self.task.cancel()
#             print("disconnect", close_code)
#         except BaseException as e:
#             print(e)
