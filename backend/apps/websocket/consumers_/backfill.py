from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import json
from pymongo import MongoClient, DESCENDING
from asgiref.sync import sync_to_async, async_to_sync
from utils.consumer_utils import (
    find_tag,
    retrieve_backfill_data,
    createThread,
    delThread,
)
import os
import environ

env = environ.Env(DEBUG=(bool, False))


class WSConsumerBackfill(AsyncWebsocketConsumer):
    def send_messages(self):
        try:
            qs = retrieve_backfill_data(**self.kwargs)
            async_to_sync(self.send)(json.dumps(qs, ensure_ascii=False))
        except asyncio.CancelledError:
            self.is_active = False

    async def connect(self):
        await self.accept()
        mongo_client = env("Mongo_Client")
        mongodb_name = env("MongoDb_Backfill_Name")
        self.client = MongoClient(mongo_client)
        self.mongo_db = self.client[mongodb_name]
        self.collection = self.mongo_db[mongodb_name]
        self.tag_id = self.scope["url_route"]["kwargs"]["tag_id"]
        self.tag_name = await sync_to_async(find_tag)(self.tag_id)
        self.kwargs = {
            "query": {
                "$and": [
                    {"tag_name": self.tag_name},
                ]
            },
            "collection": self.collection,
        }
        self.thread = createThread(self.send_messages)

    async def receive(self, text_data):
        try:
            start_date, end_date = text_data.split(",")
            query = {
                "$and": [
                    {"tag_name": self.tag_name},
                    {"date": {"$gte": start_date}},
                    {"date": {"$lte": end_date}},
                ]
            }
            self.kwargs["query"] = query
            qs = await sync_to_async(retrieve_backfill_data)(**self.kwargs)
            await self.send(json.dumps(qs, ensure_ascii=False))
        except BaseException as e:
            print(e)

    async def disconnect(self, close_code):
        try:
            delThread(self.thread)
            # self.client.close()
            print("disconnect", close_code)
        except BaseException as e:
            print(e)
