from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from utils.validations import CustomValidationError400
from utils.models_utils import validate_find
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import type_ref
from apps.item.models import item


class GetTransactionsReadRefByItemView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        obj = type_ref.objects.filter(
            VALID_TYPE=str(kwargs["item"]).upper(), TYPE__icontains="_READ"
        ).values()
        return Response(obj)


class GetTypeRefByItemView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        obj = type_ref.objects.filter(
            HIDDEN="False", VALID_TYPE=str(kwargs["item"]).upper()
        ).values()
        return Response(obj)


class GetTypeRefByItemIdView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        item_type = item.objects.filter(ITEM_ID=kwargs["item_id"]).values_list(
            "ITEM_TYPE", flat=True
        )[0]
        obj = type_ref.objects.filter(
            VALID_TYPE=item_type, TYPE__icontains="_READ"
        ).values()
        return Response(obj)
