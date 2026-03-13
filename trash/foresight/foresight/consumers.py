# chat/consumers.py
import json
#from channels.generic.websocket import AsyncWebsocketConsumer
from channels.consumer import SyncConsumer
from asgiref.sync import async_to_sync
from django.conf import settings

class DataConsumer(SyncConsumer):
    
    def websocket_connect(self, event):
        self.send({
            'type': 'websocket.accept'
        })

        # Join ticks group
        async_to_sync(self.channel_layer.group_add)(
            settings.DATA_GROUP_NAME,
            self.channel_name
        )

    def websocket_disconnect(self, event):
        # Leave ticks group
        async_to_sync(self.channel_layer.group_discard)(
            settings.DATA_GROUP_NAME,
            self.channel_name
        )

    def new_data(self, event):
        self.send({
            'type': 'websocket.send',
            'text': event['content'],
        })