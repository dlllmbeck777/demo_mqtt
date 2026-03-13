import json
import time
from utils.permissions.admin import (
    CreatePermission,
    ReadPermission,
    UpdatePermission,
    DeletePermission,
    ItemCreatePermission,
)
from utils.utils import get_info_message
from django.shortcuts import render
from rest_framework import generics, permissions, status
from .models import item
from .serializers import (
    ItemSaveSerializer,
    ItemDetailsSerializer,
    ItemSpacialSaveSerializer,
    ItemsSaveSerializer,
)
from rest_framework.response import Response
from services.parsers.addData.type import typeAddData
import uuid
from apps.item_property.serializers import (
    ItemPropertyNameSerializer,
    ItemPropertySpacialSaveSerializer,
)
from django.db.models import Max
from apps.item_property.models import item_property
from utils.models_utils import (
    validate_model_not_null,
    validate_find,
)
from apps.item_link.models import item_link
from apps.type_link.models import type_link
from apps.item_link.serializers import ItemLinkDetailsSerializer
from apps.type_link.serializers import TypeLinkDetailsSerializer
from services.logging.Handlers import KafkaLogger
from utils.utils import redisCaching as Red
from django.db import transaction
from django.db.models import Max, Subquery, OuterRef
from utils.validations import CustomValidationError400

logger = KafkaLogger()
create_per = CreatePermission(model_type="CONFIGURATION")
read_per = ReadPermission(model_type="CONFIGURATION")
update_per = UpdatePermission(model_type="CONFIGURATION")
delete_per = DeletePermission(model_type="CONFIGURATION")


class ItemSaveView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        validate_model_not_null(request.data, "item", request)
        serializer.is_valid()
        data = serializer.create(request.data)
        message = "Succsesfull created for item"

        cache_key = str(request.user) + request.data.get("ITEM_ID")
        Red.delete(cache_key)
        return Response("Succsesfull", status=status.HTTP_201_CREATED)


# class ItemScriptSaveView(generics.CreateAPIView):
#     permission_classes = [permissions.AllowAny]

#     def _itemSave(self, request):
#         serializer = ItemSpacialSaveSerializer(data=request.data["ITEM"])
#         serializer.is_valid(raise_exception=True)
#         items = serializer.save(request)

#     def _propertySave(self, request):
#         for property_data in request.data["PROPERTYS"]:
#             property_data["ITEM_ID"] = request.data["ITEM"].get("ITEM_ID")
#             property_data["ITEM_TYPE"] = request.data["ITEM"].get("ITEM_TYPE")
#             property_data["LAST_UPDT_USER"] = str(request.user)
#             property_data["LAYER_NAME"] = request.data["ITEM"].get("LAYER_NAME")
#             property_serializer = ItemPropertySpacialSaveSerializer(data=property_data)
#             property_serializer.is_valid(raise_exception=True)
#             property_serializer.save(property_data)

#     # def _deleteProperty(self, request):
#     #     if request.data.get("DELETED"):
#     #         item_property.objects.filter(
#     #             ITEM_ID=request.data["ITEM"].get("ITEM_ID"),
#     #             START_DATETIME__in=request.data.get("DELETED"),
#     #         ).delete()

#     def post(self, request, *args, **kwargs):
#         with transaction.atomic():
#             self._itemSave(request)
#             try:
#                 self._propertySave(request)
#                 # self._deleteProperty(request)
#                 Red.delete(str(request.user) + request.data["ITEM"].get("ITEM_TYPE"))
#                 msg = get_info_message("ITEM.UPDATE.SUCCESS")
#                 data = {"status_code": 200, "status_message": msg}
#                 return Response(data, status=status.HTTP_200_OK)
#             except Exception as e:
#                 transaction.set_rollback(True)
#                 raise e


class ItemCreateView(generics.CreateAPIView):
    serializer_class = ItemsSaveSerializer
    permission_classes = [ItemCreatePermission]

    def _itemSave(self, request):
        try:
            serializer = ItemSpacialSaveSerializer(data=request.data["ITEM"])
            serializer.is_valid(raise_exception=True)
            items = serializer.save(request)
        except:
            msg = get_info_message("ITEM.CREATE.FAIL", self.request.data["CULTURE"])
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg},
            )

    def _propertySave(self, request):
        for property_data in request.data["PROPERTYS"]:
            property_data["ITEM_ID"] = request.data["ITEM"].get("ITEM_ID")
            property_data["ITEM_TYPE"] = request.data["ITEM"].get("ITEM_TYPE")
            property_data["LAST_UPDT_USER"] = str(request.user)
            property_data["ROW_ID"] = uuid.uuid4().hex
            property_data["LAYER_NAME"] = request.data["ITEM"].get("LAYER_NAME")
            property_serializer = ItemPropertySpacialSaveSerializer(data=property_data)
            property_serializer.is_valid(raise_exception=True)
            property_serializer.save(property_data)

    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                self._itemSave(request)
                try:
                    self._propertySave(request)
                except Exception as e:
                    print(str(e))
                    transaction.set_rollback(True)

                msg = get_info_message(
                    "ITEM.CREATE.SUCCESS", self.request.data["CULTURE"]
                )
                data = {"status_code": 200, "status_message": msg}
                return Response(data, status=status.HTTP_200_OK)
        except:
            msg = get_info_message("ITEM.CREATE.FAIL", self.request.data["CULTURE"])
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg},
            )


class ItemUpdateView(generics.CreateAPIView):
    serializer_class = ItemsSaveSerializer
    permission_classes = [permissions.AllowAny, update_per]

    def post(self, request, *args, **kwargs):
        serializer = ItemsSaveSerializer(data=request.data["ITEM"])
        serializer.is_valid(raise_exception=True)
        msg = serializer.update_item(request)
        print(msg)
        data = {"status_code": 200, "status_message": msg}
        return Response(data, status=status.HTTP_200_OK)


# from apps.layer.tasks import async_create_database


class Item2View(generics.ListAPIView):
    serializer_class = ItemSaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        # async_create_database.delay({"key": "value", "key2": "value2"})
        return Response({"Message": "Successful"}, status=status.HTTP_200_OK)


class ItemView(generics.ListAPIView):
    serializer_class = ItemSaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        typeAddData.import_data("ITEM")
        return Response({"Message": "Successful"}, status=status.HTTP_200_OK)


class ItemDetailsView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny, read_per]
    lookup_field = "pk"

    def list(self, request, *args, **kwargs):
        item_type = self.kwargs["item"].upper()
        cache_key = str(request.user) + str(item_type)
        cache_data = Red.get(cache_key)
        if cache_data:
            Response(cache_data, status=status.HTTP_200_OK)
        property_names = (
            item_property.objects.filter(ITEM_TYPE=item_type, PROPERTY_TYPE="NAME")
            .order_by("ITEM_ID", "-START_DATETIME")
            .distinct("ITEM_ID")
        )

        serializer = ItemPropertyNameSerializer(property_names, many=True)
        # Red.set(cache_key, serializer.data)
        message = f"{request.user} listed the {item_type} items"

        return Response(serializer.data, status=status.HTTP_200_OK)


class ItemDeleteView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny, delete_per]

    def post(self, request, *args, **kwargs):
        try:
            queryset = item.objects.filter(ITEM_ID=request.data.get("ITEM_ID"))
            validate_find(queryset, request)
            queryset.delete()
            queryset_prop = item_property.objects.filter(
                ITEM_ID=request.data.get("ITEM_ID")
            )
            self._deleteItems(queryset_prop, request)
            queryset_to_item = item_link.objects.filter(
                TO_ITEM_ID=request.data.get("ITEM_ID")
            )
            self._deleteItems(queryset_to_item, request)
            queryset_from_item = item_link.objects.filter(
                FROM_ITEM_ID=request.data.get("ITEM_ID")
            )
            self._deleteItems(queryset_from_item, request)
            message = "Succsesfull deleted for items"

            cache_key = str(request.user) + request.data.get("ITEM_ID")
            Red.delete(cache_key)
            msg = get_info_message("ITEM.UPDATE.SUCCESS", self.request.get("CULTURE"))
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except:
            msg = get_info_message("ITEM.UPDATE.FAIL", self.request.get("CULTURE"))
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg},
            )

    def _deleteItems(self, qs, request):
        for data in qs:
            validate_find(data, request)
            data.delete()
