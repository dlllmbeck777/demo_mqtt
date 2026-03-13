import uuid
import couchdb
from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from apps.templates.orm_CodeList import CodeListORM
from services.logging.Handlers import KafkaLogger
from services.parsers.addData.type import typeAddData
from utils.utils import redisCaching as Red

# Create your views here.
from .models import feedback


class FeedBackSaveView(generics.CreateAPIView):
    authentication_classes = ()
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        feedback.objects.create(**request.data)
        return Response({"Message": "Successful"}, status=status.HTTP_200_OK)
