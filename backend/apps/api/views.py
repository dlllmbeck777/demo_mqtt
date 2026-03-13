from django.shortcuts import render
from utils.utils import import_data
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework import status
from apps.uom_base_unit.models import uom_base_unit
from apps.layer.helpers import to_layerDb
from apps.type.models import type as types
import uuid
from apps.tags.models import tags as item
from apps.resources_types.models import resources_types
from apps.roles_property.models import roles_property
from apps.bi_layouts.models import bi_layout
from apps.roles.models import roles
from apps.roles.serializers import RolesPropertySerializer
from apps.resources_drawer.models import resources_drawer
from apps.users.models import User
from apps.logs.paginations import SimplePaginations
from apps.users.serializers import ResetNewPasswordSerializer
from apps.resources_drawer.helpers import set_child_by_culture
from services.health_status.helper import get_health_status_messages
from influxdb_client import InfluxDBClient
from pymongo import MongoClient, DESCENDING
import os
from utils.service_config import INFLUX_ORG, INFLUX_TOKEN, INFLUX_URL

# from .tasks import test


class DjangoHealthView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({"Message": "200"}, status=status.HTTP_200_OK)


class TestView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    pagination_class = SimplePaginations

    def get(self, request, *args, **kwargs):
        to_layerDb("STD")
        to_layerDb("Horasan")
        # roles_property.objects.all().delete()
        message = import_data(roles, "roles", is_relationship=True)
        # roles_property.objects
        # test = ["demouser1@gmail.com","demouser2@gmail.com","demoadmin@gmail.com","umut@gmail.com"]
        # base_settings = user_settings.objects.filter(USER="ealp@gmail.com").values().first()
        # base_settings.pop('ROW_ID')
        # base_settings.pop('id')
        # base_settings.pop('USER')
        # for item in test:
        #     to_layerDb("Inkai")
        #     row_id = uuid.uuid4().hex

        #     user_settings.objects.filter(USER = item).update(**base_settings)

        # obj = item_event.objects.all().values()
        # for item in obj:
        #     item["ROW_ID"] = uuid.uuid4().hex
        #     item_event.objects.filter(id=item["id"]).update(**item)
        return Response("serializer.data", status=status.HTTP_200_OK)
