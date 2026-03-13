from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from datetime import datetime
from django.shortcuts import render
from rest_framework import generics, permissions, status
from .models import item_property
from .serializers import (
    ItemPropertyDetailsSerializer,
    ItemPropertySaveSerializer,
)

from django.db import transaction
from rest_framework.response import Response
from services.parsers.addData.type import typeAddData
import uuid
from utils.models_utils import (
    validate_find,
)
from services.logging.Handlers import KafkaLogger
from django.db.models import F
from utils.utils import get_info_message
from utils.validations import CustomValidationError400

logger = KafkaLogger()


class ItemPropertyUpdateView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                try:
                    pass
                except Exception as e:
                    print(str(e))
                    transaction.set_rollback(True)

                msg = get_info_message("ITEM.CREATE.SUCCESS")
                data = {"status_code": 200, "status_message": msg}
                return Response(data, status=status.HTTP_200_OK)
        except:
            msg = get_info_message("ITEM.CREATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg},
            )


# Create your views here.
class ItemPropertyScriptSaveView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        item_property.objects.create(**request.data)
        # print(request.data)
        message = "Succsesful created item property"

        return Response({"Message": request.data}, status=status.HTTP_201_CREATED)


class ItemPropertyView(generics.ListAPIView):
    serializer_class = ItemPropertyDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        typeAddData.import_data("ITEM_PROPERTY")
        message = "Succsesful created item property"

        return Response({"Message": message}, status=status.HTTP_200_OK)


class ItemPropertyDetailsView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        queryset = item_property.objects.filter(
            ITEM_ID=request.data.get("ITEM_ID")
        ).order_by("START_DATETIME")
        validate_find(queryset, request)
        serializer = ItemPropertyDetailsSerializer(queryset, many=True)
        grouped_data = {}
        for item in serializer.data:
            date = item["START_DATETIME"]
            if date not in grouped_data:
                grouped_data[date] = []
            grouped_data[date].append(item)

        # for index in range(0, len(serializer.data)):
        #     new_dict = dict(serializer.data[index])
        #     tempt_dict = dict()
        #     for keys, values in new_dict.items():
        #         if not values:
        #             serializer.data[index].pop(keys)
        #         if keys == "START_DATETIME":
        #             tempt_dict[values] = new_dict
        #             temp_data.append(tempt_dict)

        # tempt_key = []
        # tempt_dict = dict()
        # for index in range(0, len(temp_data)):
        #     data = temp_data[index]
        #     for key, value in data.items():
        #         try:
        #             x = tempt_key.index(key)
        #             values = tempt_dict.get(key)
        #             values.append(value)
        #             tempt_dict[key] = values

        #         except:
        #             tempt_key.append(key)
        #             values = []
        #             values.append(value)
        #             tempt_dict[key] = values

        # deneme = dict()
        # for index in range(1,len(temp_data)):
        #     keys = list(temp_data[index].keys())[0]
        #     listt= []
        #     try:
        #         keys2 = list(temp_data[index+1].keys())[0]
        #         if keys == keys2:
        #             print('GİRDİ',str(index))
        #             listt.append(list(temp_data[index].values())[0])
        #             listt.append(list(temp_data[index+1].values())[0])
        #             deneme[keys] = listt
        #     except:
        #         keys2 = list(temp_data[index-1].keys())[0]
        #         deneme.get(keys2).append(list(temp_data[index].values())[0])
        #         pass

        message = "Succsesful listed item property"

        return Response(grouped_data, status=status.HTTP_200_OK)


class ItemGetRPMValueView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        from apps.layer.helpers import to_layerDb

        to_layerDb(kwargs['layer'])
        obj = item_property.objects.filter(PROPERTY_TYPE="RPM").values(
            "ITEM_ID", "PROPERTY_VALUE"
        )
        data = []
        for item in obj:
            item_name = item_property.objects.filter(
                PROPERTY_TYPE="NAME", ITEM_ID=item["ITEM_ID"]
            ).values("PROPERTY_STRING")[0]
            dicts = {item_name["PROPERTY_STRING"]: item["PROPERTY_VALUE"]}
            data.append(dicts)
        return Response(data, status=status.HTTP_200_OK)


class ItemPropertyDeleteView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        queryset = item_property.objects.filter(ROW_ID=request.data.get("ROW_ID"))
        validate_find(queryset, request)
        queryset.delete()
        message = "Succsesful deleted item property"

        return Response("Succsesful Delete", status=status.HTTP_200_OK)


class ItemPropertysColumnDeleteView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            item_id = request.data.get("ITEM")["ITEM_ID"]
            deleted = request.data.get("DELETED")
            queryset = item_property.objects.filter(
                ITEM_ID=item_id, START_DATETIME__in=deleted
            )
            validate_find(queryset, request)
            queryset.delete()
            message = "Succsesful deleted item property"

            msg = get_info_message("ITEM.CREATE.SUCCESS", self.request.get("CULTURE"))
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except:
            msg = get_info_message("ITEM.CREATE.FAIL", self.request.get("CULTURE"))
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg},
            )
