import json
import redis
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import environ
import asyncio

env = environ.Env(DEBUG=(bool, False))


class ImportTagConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.rds = redis.StrictRedis(env("REDIS_HOST"), port=6379, db=0)
        self.types = self.scope["url_route"]["kwargs"]["types"]
        self.import_tag_channel = self.types
        await self.channel_layer.group_add(self.import_tag_channel, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.import_tag_channel, self.channel_name
        )
        self.rds.connection_pool.disconnect()

    async def receive(self, text_data):
        pass

    @sync_to_async
    def get_data(self):
        data = list(self.rds.lrange(self.types, -500, -1))
        data_list = [d.decode("utf-8") for d in data]
        return data_list

    async def send_data(self, event):
        try:
            old_data = ""
            while self.is_active:
                data = await self.get_data()
                if data != old_data:
                    if self.is_active:
                        try:
                            await self.send(json.dumps(data, ensure_ascii=False))
                        except:
                            print("HATA YAKALNDI live last data")
                    old_data = data
                await asyncio.sleep(0.01)
        except asyncio.CancelledError:
            self.is_active = False

    async def data_changed(self, event):
        await self.send_data(event)

    async def websocket_data_consumer(self, message):
        await self.send_data(None)

    async def websocket_disconnect(self, message):
        self.is_active = False
        await self.close()

    async def websocket_connect(self, message):
        self.rds = redis.StrictRedis(env("REDIS_HOST"), port=6379, db=0)
        self.types = self.scope["url_route"]["kwargs"]["types"]
        self.import_tag_channel = self.types
        await self.channel_layer.group_add(self.import_tag_channel, self.channel_name)
        await self.accept()
        self.is_active = True
        await self.websocket_data_consumer(None)
