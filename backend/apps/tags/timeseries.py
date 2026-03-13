from io import BytesIO
from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.http import JsonResponse, HttpResponse
from .models import tags
from .helpers import data_generator
import json
import redis
import environ
import gzip
import json
import zipfile
from django.http import HttpResponse

env = environ.Env(DEBUG=(bool, False))
import time


class LiveAllDataView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        # response_data = {"data": list()}
        start_time = time.time()
        data = data_generator(kwargs["tagid"], label=False)
        end_time = time.time()
        execution_time = end_time - start_time
        print(execution_time)
        return Response(data)


import zipfile
import threading
from io import BytesIO
from django.http import HttpResponse
import json
import redis
# from compression_middleware.decorators import compress_page


class TabularLiveAllDataView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    # @compress_page
    def get(self, request, *args, **kwargs):
        response_data = {"data": list()}
        data = data_generator(kwargs["tagid"], label=True)
        return Response(data)
