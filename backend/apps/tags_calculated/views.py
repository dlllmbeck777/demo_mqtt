from django.shortcuts import render
from utils.validations import CustomValidationError400
from rest_framework import generics, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from django.db import transaction
from utils.models_utils import validate_model_not_null
from django.utils import timezone
from services.health_status.helper import send_kafka
from utils.utils import get_info_message, tag_import_mandorty
from io import StringIO, BytesIO
import io
import pandas as pd
import numpy as np
from apps.item_property.models import item_property
from datetime import datetime

# Create your views here.
from .serializers import (
    TagCalculatedSaveSerializer,
    TagCalculatedGetNameSerializers,
    TagCalculatedGetAllDetailsSerializers,
    TagsCalculatedSaveAndUpdateSerializer,
    TagsCalculatedImportFileSerializer,
)
from .models import tags_calculated
from apps.item_link.serializers import ItemLinkSaveSerializer
from apps.type_property.models import type_property
from apps.type_property.serializers import TypePropertyDetailsSerializer
from apps.tags.helpers import TagsPropertyResourceLabel
from django.db.models import Q
import uuid
import redis
import environ
from utils.utils import redisCaching as Red
from apps.layer.helpers import to_layerDb

env = environ.Env(DEBUG=(bool, False))
rds = redis.StrictRedis(env("REDIS_HOST"), port=6379, db=0)


class TagCalculatedSaveView(generics.CreateAPIView):
    serializer_class = TagCalculatedSaveSerializer
    permission_classes = [permissions.AllowAny]


class TagCalculatedTVDetailsView(generics.ListAPIView):
    serializer_class = TagCalculatedGetNameSerializers
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        queryset = tags_calculated.objects.all()
        serializer = TagCalculatedGetNameSerializers(queryset, many=True)
        return Response(serializer.data)


class TagCalculatedDetailsByIDView(generics.ListAPIView):
    serializer_class = TagCalculatedGetAllDetailsSerializers
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        tag_id = request.data["TAG_ID"]
        queryset = tags_calculated.objects.filter(TAG_ID=tag_id)
        serializer = TagCalculatedGetAllDetailsSerializers(queryset, many=True)
        return Response(serializer.data)


class TagCalculatedPropertyView(generics.ListAPIView):
    serializer_class = TagCalculatedGetAllDetailsSerializers
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        tag_info = type_property.objects.filter(Q(TYPE="TAG_INFO") | Q(TYPE="TAG_CAL"))
        tag_link = type_property.objects.filter(TYPE="TAG_LINK")
        serializer_info = TypePropertyDetailsSerializer(tag_info, many=True).data
        serializer_link = TypePropertyDetailsSerializer(tag_link, many=True).data
        tag_INFO = []
        tag_LINK = []
        TagsPropertyResourceLabel(
            serializer_info, tag_INFO, request.data.get("CULTURE")
        )
        TagsPropertyResourceLabel(
            serializer_link, tag_LINK, request.data.get("CULTURE")
        )
        new_dict = {"TAG_INFORMATIONS": tag_INFO, "TAG_LINK": tag_LINK}
        return Response(new_dict, status=status.HTTP_200_OK)


class TagsCalculatedSaveAndUpdateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            tags_dict = request.data
            link_dict = {
                "LINK_ID": tags_dict.get("LINK_ID"),
                "TO_ITEM_ID": tags_dict.get("ITEM_ID"),
                "TO_ITEM_TYPE": tags_dict.get("TRANSACTION_TYPE"),
                "END_DATETIME": "9000-01-01",
                "FROM_ITEM_ID": tags_dict.get("TAG_ID"),
                "FROM_ITEM_TYPE": "TAG_CACHE",
                "LINK_TYPE": "TAG_ITEM",
                "START_DATETIME": "2023-01-01",
                "ROW_ID": uuid.uuid4().hex,
                # "LAST_UPDT_USER":request.user
            }
            del tags_dict["LINK_ID"]
            tags_dict["LAST_UPDT_DATE"] = int(datetime.now().timestamp() * 1000)
            tags_dict["LAST_UPDT_USER"] = str(request.user)
            validate_model_not_null(tags_dict, "tags", request=request)
            serializer = TagsCalculatedSaveAndUpdateSerializer(data=tags_dict)
            serializer.is_valid()
            message_save_tag_cal = serializer.save(tags_dict)
            try:
                validate_model_not_null(link_dict, "ITEM_LINK", request=request)
                link_serializer = ItemLinkSaveSerializer(data=link_dict)
                link_serializer.is_valid()
                message = link_serializer.save(link_dict)
                # print(message)
                # print(tags_dict["OPERATIONS_TYPE"].lower())
                # import json

                # data = json.dumps(tags_dict)
                if message_save_tag_cal == "Save":
                    send_kafka(
                        topic=str(tags_dict["OPERATIONS_TYPE"].lower()),
                        data={
                            "NAME": request.data["NAME"],
                            "TAG_ID": request.data["TAG_ID"],
                            "layer": request.active_layers,
                        },
                    )
                msg = get_info_message("TAGCALC.UPDATE.SUCCESS")
                data = {"status_code": 200, "status_message": msg}
                return Response(data, status=status.HTTP_200_OK)

            except Exception as e:
                transaction.set_rollback(True)
                msg = get_info_message("TAGCALC.UPDATE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )


class TagsCalculatedDeleteView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            qs = tags_calculated.objects.filter(TAG_ID=request.data.get("TAG_ID"))
            if qs:
                qs.delete()
            msg = get_info_message("TAGCALC.DELETE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            msg = get_info_message("TAGCALC.DELETE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class TagsCalculatedImportView(generics.CreateAPIView):
    serializer_class = TagsCalculatedImportFileSerializer
    permission_classes = [permissions.AllowAny]

    def check_column_name(self, data):
        unnamed_name = []
        for item in list(data.columns):
            if "Unnamed:" in item:
                unnamed_name.append(item)
                # "Unnamed: 0" sütunu varsa, bu sütunu sil
        for name in unnamed_name:
            data.drop(name, axis=1, inplace=True)
        return data

    def post(self, request, *args, **kwargs):
        try:
            try:
                csv_data = pd.read_csv(
                    BytesIO(request.FILES["file"].read()),
                    encoding="ISO-8859-1",
                    sep=";",
                    index_col=False,
                )

                if len(csv_data.columns) < 2:
                    print("BURDA")
                    csv_data = pd.read_csv(
                        BytesIO(request.FILES["file"].read()),
                        encoding="ISO-8859-1",
                        sep=",",
                        index_col=False,
                    )
                    print(csv_data)
            except Exception as e:
                print(str(e))
                csv_data = pd.read_excel(
                    BytesIO(request.FILES["file"].read()),
                    encoding="ISO-8859-1",
                    sep=";",
                )
            self.check_column_name(csv_data)
            csv_data["LINK_TO"] = csv_data["TRANSACTION_PROPERTY"]
            tag_import_mandorty(list(csv_data.columns))
            if "LINK_TO" in list(csv_data.columns):
                csv_data.rename(columns={"LINK_TO": "ITEM_ID"}, inplace=True)
            csv_data = csv_data.replace(np.nan, None)
            json_data = csv_data.to_dict(orient="records")
            chunk_size = 10
            chunked_data = [
                json_data[i : i + chunk_size]
                for i in range(0, len(json_data), chunk_size)
            ]
            index = 0
            for chunk in chunked_data:
                chunk_list = self.create_list(chunk)
                index += 1
                chunk_list.append(
                    (len(csv_data), index * len(chunk), chunk_size, index)
                )
                tags_calculated.objects.bulk_create(chunk_list)
            hash_dict = Red.get("TagCalimportHistory")
            data = list(rds.lrange("importTagCal", 0, -1))
            if hash_dict:
                hash_dict[request.FILES["file"].name] = data[1].decode("utf-8")
                Red.set("TagCalimportHistory", hash_dict)
            else:
                # priint(data)
                hash_dict = {request.FILES["file"].name: data[1].decode("utf-8")}
                Red.set("TagCalimportHistory", hash_dict)
            msg = get_info_message("TAGCALC.IMPORT.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            msg = get_info_message("TAGCALC.IMPORT.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )

    def create_list(self, chunk):
        tempt = []
        for item in chunk:
            props = item_property.objects.filter(
                PROPERTY_TYPE="NAME", PROPERTY_STRING=item["ITEM_ID"]
            ).values("ITEM_ID", "ITEM_TYPE", "PROPERTY_STRING")
            if props:
                item["ITEM_ID"] = props[0]["ITEM_ID"]
                item["TRANSACTION_TYPE"] = props[0]["ITEM_TYPE"]

            else:
                item["ITEM_ID"] = None
            if item["START_DATETIME"] is None:
                now = datetime.now()
                item["START_DATETIME"] = now.strftime("%Y-%m-%d")

            item["EVENT_TYPE"] = "E"
            item["TAG_ID"] = uuid.uuid4().hex
            item["ROW_ID"] = uuid.uuid4().hex
            item["LAYER_NAME"] = "Inkai"

            models = tags_calculated(**item)
            tempt.append(models)
        print("BURDA HATA YOK")
        return tempt
