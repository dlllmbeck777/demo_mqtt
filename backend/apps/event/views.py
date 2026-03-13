from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .helpers import mongo_update_unread_notifications
from utils.consumer_utils import retrive_mongo_notifications
from .models import event
from .paginations import SimplePaginations


class MongoUpdateUnReadNotifications(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        notification_status = kwargs["status"]
        print(notification_status)
        mongo_update_unread_notifications(notification_status)
        return Response({"Message": "data"}, status=status.HTTP_200_OK)


from datetime import datetime, timedelta
from .serializers import EventSerializer


class AlarmsNotificationsView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        current_time = datetime.now()
        one_hour_ago = current_time - timedelta(hours=int(request.data.get("TIME")))
        timestamp = int(one_hour_ago.timestamp()) * 1000
        layer = request.data.get("LAYER_NAME")
        db_name = request.data.get("DB_NAME")
        query = {
            "layer": layer,
            "time": {"$gt": timestamp},
        }
        kwargs = {
            "db_name": db_name,
            "query": query,
        }
        data = retrive_mongo_notifications(**kwargs)
        return Response({"data": data}, status=status.HTTP_200_OK)


class GetAllAlarmsWithPaginationsView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = EventSerializer
    pagination_class = SimplePaginations

    def get(self, request, format=None):
        events = event.objects.all().order_by("-time")
        serializer = EventSerializer(events, many=True)

        paginated_result = self.paginate_queryset(
            serializer.data
        )  # Özel paginasyon metodu
        return self.get_paginated_response(paginated_result)
