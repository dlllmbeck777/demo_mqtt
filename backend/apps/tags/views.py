from django.shortcuts import render

from utils.validations import CustomValidationError400
from .models import tags
from pymongo import MongoClient, DESCENDING
import uuid
import os
from rest_framework import permissions, status, generics
from rest_framework.response import Response
from .helpers import TagsPropertyResourceLabel
from .serializers import (
    TagsDetiailsSerializer,
    TagsSaveSerializer,
    TagsNameSerializer,
    TagsFieldsSerializer,
    TagsUomConversionSerializer,
    TagsImportFileSerializer,
)
from apps.type_property.models import type_property
from apps.resources_types.models import resources_types
from apps.resources_types.serializers import ResourceTypesLabelSerializer
from apps.type_property.serializers import TypePropertyDetailsSerializer
from apps.item_link.models import item_link
from apps.item_link.serializers import ItemLinkSaveSerializer, ItemLinkDetailsSerializer
from apps.type_link.models import type_link
from apps.type.models import type as type_model
from apps.type.serializers import TypeResourceListManagerSerializer
from apps.code_list.models import code_list
from apps.templates.orm_CodeList import CodeListORM
from apps.type_link.serializers import TypeLinkDetailsSerializer
from utils.models_utils import validate_model_not_null
import datetime
from django.db import transaction
from io import StringIO, BytesIO
import io
import pandas as pd
import numpy as np
from apps.uom.models import uom
from apps.uom_base_unit.models import uom_base_unit
from apps.item_property.models import item_property
from utils.utils import get_info_message, tag_import_mandorty
from concurrent.futures import ThreadPoolExecutor
import asyncio
from utils.utils import redisCaching as Red
from datetime import datetime
import numpy as np
import json
import environ
import redis
from apps.layer.helpers import to_layerDb
from influxdb_client import InfluxDBClient
from utils.service_config import INFLUX_ORG, INFLUX_TOKEN, INFLUX_URL

env = environ.Env(DEBUG=(bool, False))
rds = redis.StrictRedis(env("REDIS_HOST"), port=6379, db=0)
# Create your views here.


# class TagsSaveView(generics.CreateAPIView):
#     serializer_class = TagsFieldsSerializer
#     permission_classes = [permissions.AllowAny]

#     def post(self, request, *args, **kwargs):
#         data = request.data
#         data["LAYER_NAME"] = "KNOC"
#         tags.objects.create(**data)
#         return Response("okey")


class TagsSaveView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            tags_dict = request.data
            print('Transaction atomic 7777777 --------------------------------')
            link_dict = {
                "LINK_ID": tags_dict.get("LINK_ID"),
                "TO_ITEM_ID": tags_dict.get("ITEM_ID"),
                "TO_ITEM_TYPE": tags_dict.get("TRANSACTION_TYPE"),
                "END_DATETIME": "9999999999", #"9000-01-01",
                "FROM_ITEM_ID": tags_dict.get("TAG_ID"),
                "FROM_ITEM_TYPE": "TAG_CACHE",
                "LINK_TYPE": "TAG_ITEM",
                "START_DATETIME": "1558569600000", #"2023-01-01",
                "ROW_ID": uuid.uuid4().hex,
                # "LAST_UPDT_USER":request.user
            }
            del tags_dict["LINK_ID"]

            tags_dict["LAST_UPDT_DATE"] = int(datetime.now().timestamp() * 1000)
            validate_model_not_null(tags_dict, "tags", request=request)
            serializer = TagsSaveSerializer(data=tags_dict)

            serializer.is_valid()
            serializer.save(tags_dict)
            try:
                validate_model_not_null(link_dict, "ITEM_LINK", request=request)
                print('REQ111: ++++++++++++++++++++++++++++++++++++++++++',request.data)
                print('REQ222: ++++++++++++++++++++++++++++++++++++++++++',request.data.get("LINK"))
                link_serializer = ItemLinkSaveSerializer(data=request.data.get("LINK"))
                link_serializer.is_valid()
                message = link_serializer.save(link_dict)
                msg = get_info_message("TAG.UPDATE.SUCCESS")
                data = {"status_code": 200, "status_message": msg}
                return Response(data, status=status.HTTP_200_OK)
            except Exception as e:
                print(str(e))
                transaction.set_rollback(True)
                msg = get_info_message("TAG.UPDATE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )


class WorkflowItemGetTagView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TagsFieldsSerializer

    def get_queryset(self):
        pass

    def post(self, request, *args, **kwargs):
        data = request.data
        queryset = (
            tags.objects.filter(ITEM_ID__in=data)
            .order_by("NAME")
            .values("TAG_ID", "NAME", "SHORT_NAME")
        )
        return Response(queryset, status=status.HTTP_200_OK)


class TagsDetailsView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def get(self, request, *args, **kwargs):
        queryset = tags.objects.all().order_by("NAME").values()
        serializer = TagsDetiailsSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TagsDetailsForLayerView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def get(self, request, *args, **kwargs):
        to_layerDb(kwargs["layer"])
        queryset = (
            tags.objects.all()
            .order_by("NAME")
            .values(
                "NAME",
                "NORMAL_MAXIMUM",
                "NORMAL_MINIMUM",
                "LIMIT_LOLO",
                "LIMIT_HIHI",
                "TRANSACTION_PROPERTY",
            )
        )
        return Response(queryset, status=status.HTTP_200_OK)


class TagsSpesificDetailsView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def post(self, request, *args, **kwargs):
        queryset = tags.objects.filter(TAG_ID=request.data.get("TAG_ID"))
        serializer = TagsFieldsSerializer(queryset, many=True)
        qs_item = item_link.objects.filter(FROM_ITEM_ID=request.data.get("TAG_ID"))
        if qs_item:
            item_serializer = ItemLinkDetailsSerializer(qs_item, many=True)
            serializer.data[0]["LINK_ID"] = item_serializer.data[0].get("LINK_ID")
        return Response(serializer.data, status=status.HTTP_200_OK)


class TagsDeleteView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            qs = tags.objects.filter(TAG_ID=request.data.get("TAG_ID"))
            if qs:
                qs.delete()
            msg = get_info_message("TAG.DELETE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            msg = get_info_message("TAG.DELETE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class TagsImportDeleteView(generics.ListAPIView):
    serializer_class = TagsImportFileSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        print("get")
        types = kwargs["types"]
        Red.delete(types)
        return Response("Successful", status=status.HTTP_200_OK)


class TagsImportHistoryListView(generics.ListAPIView):
    serializer_class = TagsImportFileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def get(self, request, *args, **kwargs):
        try:
            types = kwargs["types"]
            hash_dict = Red.get(types)
            keys = list(hash_dict.keys())
            return Response(keys, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TagsImportHistoryView(generics.ListAPIView):
    serializer_class = TagsImportFileSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "pk"

    def get_queryset(self):
        pass

    def get(self, request, *args, **kwargs):
        try:
            types = kwargs["types"]
            hash_dict = Red.get(types)
            keys = kwargs["keys"]
            data = json.loads(hash_dict.get(keys))
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TagsImportView(generics.CreateAPIView):
    serializer_class = TagsImportFileSerializer
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
                    csv_data = pd.read_csv(
                        BytesIO(request.FILES["file"].read()),
                        encoding="ISO-8859-1",
                        sep=",",
                        index_col=False,
                    )
            except:
                csv_data = pd.read_excel(
                    BytesIO(request.FILES["file"].read()),
                    encoding="ISO-8859-1",
                    sep=";",
                )
            self.check_column_name(csv_data)
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
                tags.objects.bulk_create(chunk_list)
            hash_dict = Red.get("importHistory")
            data = list(rds.lrange("importTag", 0, -1))
            if hash_dict:
                hash_dict[request.FILES["file"].name] = data[1].decode("utf-8")
                Red.set("importHistory", hash_dict)
            else:
                hash_dict = {request.FILES["file"].name: data[1].decode("utf-8")}
                Red.set("importHistory", hash_dict)
            msg = get_info_message("TAG.IMPORT.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            msg = get_info_message("TAG.IMPORT.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )

    def create_list(self, chunk):
        tempt = []
        for item in chunk:
            props = item_property.objects.filter(
                PROPERTY_TYPE="NAME", PROPERTY_STRING=item["ITEM_ID"]
            ).values("ITEM_ID", "ITEM_TYPE")
            item["ITEM_ID"] = None
            if props:
                item["ITEM_ID"] = props[0]["ITEM_ID"]
                item["TRANSACTION_TYPE"] = props[0]["ITEM_TYPE"]

            if item["START_DATETIME"] is None:
                now = datetime.now()
                item["START_DATETIME"] = now.strftime("%Y-%m-%d")

            item["EVENT_TYPE"] = "E"
            item["TAG_ID"] = uuid.uuid4().hex
            item["ROW_ID"] = uuid.uuid4().hex
            item["LAYER_NAME"] = "TEST"
            models = tags(**item)
            tempt.append(tags(**item))
        return tempt


# class TagsImportView(generics.CreateAPIView):

#     serializer_class = TagsSaveSerializer
#     permission_classes = [permissions.AllowAny]

#     def post(self, request, *args, **kwargs):
#         with transaction.atomic():
#             try:
#                 data = request.data
#                 chunked_data = [data[i:i+1000] for i in range(0, len(data), 1000)]
#                 if is_relationship:
#                     for chunk in chunked_data:
#                         tags.objects.bulk_create(chunk)
#                 else:
#                     for chunk in chunked_data:
#                         tags.objects.bulk_create([tags(**item) for item in chunk])
#                 return Response("Succsessful", status=status.HTTP_200_OK)
#             except Exception as e:
#                 print(str(e))
#                 transaction.set_rollback(True)
#                 return{"error": str(e)}


class TagsPropertysView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        tag_info = type_property.objects.filter(TYPE="TAG_INFO")
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


class TagsTypeLinkView(generics.CreateAPIView):
    def get_queryset(self):
        pass

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        culture = request.data.get("CULTURE")
        to_type = list(
            type_link.objects.filter(TYPE="TAG_ITEM")
            .values_list("TO_TYPE", flat=True)
            .order_by("TO_TYPE")
        )
        query = (
            type_model.objects.filter(TYPE__in=to_type)
            .values_list("LABEL_ID", flat=True)
            .order_by("TYPE")
        )

        qs_resource = resources_types.objects.filter(
            ID__in=query, CULTURE=culture
        ).order_by("ID")

        labels = ResourceTypesLabelSerializer(qs_resource, many=True).data
        response_value = [
            label.update({"TO_TYPE": types}) or label
            for label in labels
            for types in to_type
            if label["ID"].split(".")[1] == types
        ]

        # print(response_value)
        return Response(response_value, status=status.HTTP_200_OK)


class TagsNameViews(generics.CreateAPIView):
    serializer_class = TagsDetiailsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        queryset = tags.objects.filter(NAME=request.data.get("TAG_NAME"))
        serializer = TagsNameSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TagsSearchViews(generics.CreateAPIView):
    serializer_class = TagsDetiailsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        qs = tags.objects.filter(NAME__icontains=request.data.get("asset"))
        serializer = TagsDetiailsSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TagsUomConversionView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def get(self, request, *args, **kwargs):
        queryset = tags.objects.all().order_by("NAME").values()
        serializer = TagsUomConversionSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TagsToItemRPMView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def post(self, request, *args, **kwargs):
        to_layerDb(kwargs["layer"])
        queryset = tags.objects.filter(NAME=request.data["NAME"]).values_list(
            "ITEM_ID", flat=True
        )
        item_prop = item_property.objects.filter(
            ITEM_ID__in=queryset, PROPERTY_TYPE="RPM"
        ).values("PROPERTY_TYPE", "PROPERTY_VALUE")

        return Response(item_prop, status=status.HTTP_200_OK)


class GetVibrationsTagsView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def get(self, request, *args, **kwargs):
        to_layerDb(kwargs["layer"])
        queryset = tags.objects.filter(
            UOM_CODE="gravity acceleration linear"
        ).values_list("NAME", flat=True)

        return Response({"tags_name": queryset}, status=status.HTTP_200_OK)


class GetFFTTagsView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def post(self, request, *args, **kwargs):
        mongo_client = MongoClient(os.environ.get("Mongo_Client"))
        db = mongo_client[str(kwargs["layer"]).lower()]
        db_types = request.data["TYPE"]
        collection = db[db_types]
        # İlgili veriyi bulun
        tempt_dict = {}
        projection = {"_id": 0, "measurement": 0, "time": 0, "asset": 0}
        return_list = []
        for tag_name in request.data["TAGS"]:
            query = {"measurement": tag_name}
            latest_data = (
                collection.find(query, projection).sort([("time", -1)]).limit(1)
            )
            data = []

            for item in latest_data:
                data.append(item)

            tempt_dict[tag_name] = {
                "data": data,
            }

        mongo_client.close()

        return Response(tempt_dict, status=status.HTTP_200_OK)


# class GetTimeWaveFormTagsView(generics.CreateAPIView):
#     permission_classes = [permissions.AllowAny]

#     def get_queryset(self):
#         pass

#     def post(self, request, *args, **kwargs):
#         mongo_client = MongoClient(os.environ.get("Mongo_Client"))
#         db = mongo_client[str(kwargs["layer"]).lower()]

#         collection = db["accleration_timewaveform"]
#         # İlgili veriyi bulun
#         tempt_dict = {}
#         projection = {"_id": 0, "measurement": 0, "time": 0, "asset": 0}
#         return_list = []
#         for tag_name in request.data["TAGS"]:
#             query = {"measurement": tag_name}
#             latest_data = (
#                 collection.find(query, projection).sort([("time", -1)]).limit(1)
#             )
#             data = []

#             for item in latest_data:
#                 data.append(item)

#             tempt_dict[tag_name] = {"data": data}

#         mongo_client.close()

#         return Response(tempt_dict, status=status.HTTP_200_OK)


class GetVisulationTagsView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def post(self, request, *args, **kwargs):
        mongo_client = MongoClient(os.environ.get("Mongo_Client"))
        db = mongo_client[str(kwargs["layer"]).lower()]
        db_types = request.data["TYPE"]
        collection = db[db_types]
        # İlgili veriyi bulun
        tempt_dict = {}
        projection = {"_id": 0}

        for tag_name in request.data["TAGS"]:
            query = {"measurement": tag_name}
            latest_data = collection.find(query, projection).sort([("time", -1)])
            data = []
            for item in latest_data:
                data.append(item)
            tempt_dict[tag_name] = {"data": data}
        mongo_client.close()

        return Response(tempt_dict, status=status.HTTP_200_OK)


# class GetVelocityRMSTagsView(generics.CreateAPIView):
#     permission_classes = [permissions.AllowAny]

#     def get_queryset(self):
#         pass

#     def post(self, request, *args, **kwargs):
#         mongo_client = MongoClient(os.environ.get("Mongo_Client"))
#         db = mongo_client[str(kwargs["layer"]).lower()]
#         collection = db["velocity_rms"]
#         projection = {"_id": 0}
#         tempt_dict = {}
#         for tag_name in request.data["TAGS"]:
#             query = {"measurement": tag_name}
#             latest_data = collection.find(query, projection).sort([("time", -1)])
#             data = []
#             for item in latest_data:
#                 data.append(item)
#             tempt_dict[tag_name] = {"data": data}
#         mongo_client.close()

#         return Response(tempt_dict, status=status.HTTP_200_OK)


class GetTagNameAndShortNameByAssetView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def post(self, request, *args, **kwargs):
        queryset = tags.objects.filter(
            TRANSACTION_PROPERTY__in=request.data["ASSET"]
        ).values("NAME", "SHORT_NAME")
        return_dict = {}
        for item in queryset:
            return_dict[item["NAME"]] = item["SHORT_NAME"]
        return Response(return_dict, status=status.HTTP_200_OK)


class GetTagsAndShortNameView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def get(self, request, *args, **kwargs):
        to_layerDb(kwargs["layer"])
        queryset = tags.objects.all().values("NAME", "SHORT_NAME")
        return_value = {}
        for item in queryset:
            return_value[item["NAME"]] = item["SHORT_NAME"]

        return Response(return_value, status=status.HTTP_200_OK)


class GetTagsUomsView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def get(self, request, *args, **kwargs):
        to_layerDb(kwargs["layer"])
        queryset = tags.objects.all().values("NAME", "UOM_CODE", "TRANSACTION_PROPERTY")

        return_value = {}
        for item in queryset:
            if item["UOM_CODE"]:
                uom_obj = (
                    uom.objects.filter(CULTURE="en-US", CODE=item["UOM_CODE"])
                    .values("CATALOG_SYMBOL")
                    .first()
                )
                if not uom_obj:
                    uom_obj = (
                        uom_base_unit.objects.filter(
                            CULTURE="en-US", CODE=item["UOM_CODE"]
                        )
                        .values("CATALOG_SYMBOL")
                        .first()
                    )
                return_value[item["NAME"]] = {
                    "UOM": uom_obj["CATALOG_SYMBOL"],
                    "asset": item["TRANSACTION_PROPERTY"],
                }
        return Response(return_value, status=status.HTTP_200_OK)


class GetFFTByAssetTagsView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def post(self, request, *args, **kwargs):
        mongo_client = MongoClient(os.environ.get("Mongo_Client"))
        db = mongo_client[str(kwargs["layer"]).lower()]
        db_types = request.data["TYPE"]
        collection = db[db_types]
        # İlgili veriyi bulun
        tempt_dict = {}
        projection = {"_id": 0, "measurement": 0, "time": 0, "asset": 0}
        return_list = []
        for asset in request.data["ASSET"]:
            query = {"asset": asset}
            latest_data = (
                collection.find(query, projection).sort([("time", -1)]).limit(1)
            )
            data = []

            for item in latest_data:
                data.append(item)

            tempt_dict[asset] = {
                "data": data,
            }

        mongo_client.close()

        return Response(tempt_dict, status=status.HTTP_200_OK)


class GetLiveDataView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def post(self, request, *args, **kwargs):
        my_bucket = "horasan_live"
        data = []
        try:
            with InfluxDBClient(
                url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG, debug=False
            ) as client:
                query = f"""from(bucket: "horasan_live")
        |> range(start: -1d,stop: 1700306830)
        |> filter(fn: (r) => r["_field"] == "tag_value")
        |> filter(fn: (r) =>r["_measurement"] == "OPZ_IMX.IMX004.P-3B.VT-153_P-3B" or r["_measurement"] == "OPZ_IMX.IMX003.P-3B.VT-151_P-3B" or r["_measurement"] == "OPZ_IMX.IMX003.P-3B.VT-152_P-3B" or r["_measurement"] == "OPZ_IMX.IMX003.P-3B.VT-151_P-3B_vel")"""
                print(query)
                result = client.query_api().query(query)

                for table in result:
                    for record in table.records:
                        data.append(record.values)

        except Exception as e:
            print(str(e))

        return Response(data, status=status.HTTP_200_OK)
