import base64
from django.shortcuts import render
from utils.utils import get_info_message
from utils.validations import CustomValidationError400
from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from services.notifications import consumer
from .models import item_event
from .helpers import mongo_update_unread_notifications
from utils.consumer_utils import retrive_mongo_notifications
from datetime import datetime
from apps.layer.helpers import to_layerDb
from .serializers import ItemEventStatusSerializer, ItemEventFileSerializer
from apps.type_property.models import type_property
from apps.uom.models import uom
from apps.uom_base_unit.models import uom_base_unit
from datetime import datetime, timedelta
from .paginations.paginations import ItemEventPaginations
from .utils import retransform_uom_by_type, status_transform_uom, transform_uom_by_type


class ItemEventStateSaveView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        old_data = request.data["OLD"]
        new = request.data["NEW"]
        old_obj = item_event.objects.filter(ROW_ID=old_data["ROW_ID"])
        if old_obj:
            old_obj.update(**old_data)

        new = status_transform_uom(new, "en-US")

        new = item_event.objects.create(**new)

        return Response({"Message": "ata"}, status=status.HTTP_200_OK)


class ItemEventGetStateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        empty_data = {
            "ROW_ID": None,
            "CHAR1": None,
            "END_DATETIME": None,
            "START_DATETIME": None,
            "EVENT_TYPE": None,
        }
        obj = (
            item_event.objects.filter(
                ITEM_ID=request.data["ITEM_ID"],
                EVENT_TYPE=request.data["EVENT_TYPE"],
            )
            .order_by("-END_DATETIME")
            .values("ROW_ID", "CHAR1", "EVENT_TYPE", "START_DATETIME", "END_DATETIME")
            .first()
        )
        if obj:
            return Response(obj, status=status.HTTP_200_OK)
        return Response(empty_data, status=status.HTTP_200_OK)


class ItemEventGetStateAllColumnsView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        empty_data = {
            "ROW_ID": None,
            "CHAR1": None,
            "END_DATETIME": None,
            "START_DATETIME": None,
            "EVENT_TYPE": None,
        }
        obj = item_event.objects.filter(
            ITEM_ID=request.data["ITEM_ID"],
            EVENT_TYPE=request.data["EVENT_TYPE"],
        ).order_by("-END_DATETIME")
        serializer = ItemEventFileSerializer(obj, many=True)

        data = transform_uom_by_type(dict(serializer.data[0]), request.data["CULTURE"])

        # data = transform_uom_by_type(serializer.data[1], request.data["CULTURE"])

        return Response(data, status=status.HTTP_200_OK)


class ItemEventGetDowntimeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        culture = request.data["CULTURE"]
        obj = item_event.objects.filter(
            ITEM_ID=request.data["ITEM_ID"],
            EVENT_TYPE=request.data["EVENT_TYPE"],
        ).order_by("-END_DATETIME")
        serializer = ItemEventFileSerializer(obj, many=True)
        lists = []
        for item in serializer.data:
            data = transform_uom_by_type(dict(item), culture)
            lists.append(data)
        return Response(lists, status=status.HTTP_200_OK)


class ItemEventGetPaginationsDowntimeView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ItemEventFileSerializer
    pagination_class = ItemEventPaginations

    def get(self, request, *args, **kwargs):
        # print(request.data)
        culture = kwargs["culture"]
        event_type = kwargs["event_type"]
        obj = (
            item_event.objects.filter(
                ITEM_ID=kwargs["item_id"],
                EVENT_TYPE=event_type,
            )
            .order_by("-END_DATETIME")
            .values()
        )
        paginated_result = self.paginate_queryset(obj)
        for item in paginated_result:
            prop = type_property.objects.filter(
                TYPE=event_type, UOM__isnull=False
            ).values("UOM", "COLUMN_NAME")
            if prop:
                # print(prop)
                for column in prop:
                    uoms = self.get_uoms(culture, column["UOM"])
                    if uoms:
                        transform_data = None  # Varsa varsayılan değeri belirle
                        if (
                            uoms
                            and "A" in uoms
                            and "B" in uoms
                            and "C" in uoms
                            and "D" in uoms
                        ):
                            try:
                                denominator = float(uoms["B"]) - (
                                    float(uoms["D"])
                                    * float(item[column["COLUMN_NAME"]])
                                )

                                if denominator != 0:
                                    numerator = (
                                        (float(uoms["C"]))
                                        * float(item[column["COLUMN_NAME"]])
                                    ) - float(uoms["A"])
                                    transform_data = numerator / denominator
                                item[column["COLUMN_NAME"]] = transform_data
                            except Exception as e:
                                print(e)
                                print(item[column["COLUMN_NAME"]])

        return self.get_paginated_response(paginated_result)

    def get_uoms(self, culture, code):
        uoms = uom.objects.filter(CULTURE=culture, CODE=code).values().first()
        return uoms


class ItemEventGetDowntimeBLView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        to_layerDb(kwargs["layer"])
        obj = (
            item_event.objects.filter(
                ITEM_ID=request.data["ITEM_ID"],
                EVENT_TYPE=request.data["EVENT_TYPE"],
            )
            .order_by("-END_DATETIME")
            .values()
        )

        return Response(list(obj), status=status.HTTP_200_OK)


class ItemEventSaveView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ItemEventStatusSerializer

    def post(self, request, *args, **kwargs):
        try:
            data = request.data.dict()

            if "PDF_FILE" in data.keys():
                if data["PDF_FILE"] is not None:
                    print(data["PDF_FILE"])
                    data["PDF_FILE"] = data["PDF_FILE"].read()

            data["LAST_UPDT_USER"] = str(request.user)
            data["LAST_UPDT_DATE"] = int(datetime.now().timestamp())
            culture = data.pop("CULTURE")
            data = retransform_uom_by_type(data, culture)
            serializer = ItemEventFileSerializer()
            serializer.is_valid()
            serializer.save(data)
            msg = get_info_message("ITEM_EVENT.FORM.CREATE.SUCCESS")
            return Response(
                {
                    "status_code": 200,
                    "status_message": msg,
                }
            )

        except Exception as e:
            print(str(e), "HATA BU")
            msg = get_info_message("ITEM_EVENT.FORM.CREATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class ItemEventUpdateView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ItemEventStatusSerializer

    def post(self, request, *args, **kwargs):
        try:
            data = request.data.dict()
            for keys, item in data.items():
                if item == "null":
                    data[keys] = None
            if "PDF_FILE" in data.keys():
                if data["PDF_FILE"] is not None:
                    if data["PDF_FILE"] != "null":
                        data["PDF_FILE"] = data["PDF_FILE"].read()

            data["LAST_UPDT_USER"] = str(request.user)
            data["LAST_UPDT_DATE"] = int(datetime.now().timestamp())

            data = retransform_uom_by_type(data, "en-US")
            serializer = ItemEventFileSerializer()
            serializer.is_valid()
            serializer.save(data)
            msg = get_info_message("ITEM_EVENT.FORM.CREATE.SUCCESS")
            return Response(
                {
                    "status_code": 200,
                    "status_message": msg,
                }
            )

        except Exception as e:
            print(str(e))
            msg = get_info_message("ITEM_EVENT.FORM.CREATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class ItemEventDeleteView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            item_event.objects.filter(ROW_ID__in=request.data["DELETED_ITEM"]).delete()

            msg = get_info_message("ITEM_EVENT.FORM.CREATE.SUCCESS")
            return Response(
                {
                    "status_code": 200,
                    "status_message": msg,
                }
            )

        except Exception as e:
            print(str(e))
            msg = get_info_message("ITEM_EVENT.FORM.CREATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class ItemEventKeysView(APIView):
    permission_classes = [permissions.AllowAny]
    # serializer_class = FileSerializer

    def post(self, request, *args, **kwargs):
        to_layerDb("Inkai")
        data = request.data["FILE"]
        binary_data = data.read()
        item_event.objects.filter(ROW_ID="bdf7eee9c11f4098868765dfd0a6b4a5").update(
            pdf_file=None
        )
        return Response("a")


class ItemEventTSDowntimeView(APIView):
    permission_classes = [permissions.AllowAny]
    # serializer_class = FileSerializer

    def post(self, request, *args, **kwargs):
        first_timestamp = request.data["TIMESTAMP"]

        tarih_objesi = datetime.utcfromtimestamp(first_timestamp / 1000.0).replace(
            hour=0, minute=0, second=0, microsecond=0
        )

        ayin_birinci_gunu = tarih_objesi.replace(day=1)
        bir_sonraki_ay = (ayin_birinci_gunu.month % 12) + 1
        yeni_yil = ayin_birinci_gunu.year + (1 if bir_sonraki_ay == 1 else 0)
        bir_sonraki_ayin_birinci_gunu = ayin_birinci_gunu.replace(
            month=bir_sonraki_ay, year=yeni_yil
        )
        mevcut_ayin_son_gunu = bir_sonraki_ayin_birinci_gunu - timedelta(days=1)

        last_timestampt = int(mevcut_ayin_son_gunu.timestamp()) * 1000
        first_timestamp = int(tarih_objesi.timestamp()) * 1000
        time_dict = {}
        is_not_equal_datetime = True
        tempt_last_date = last_timestampt

        # # Bir günün saniye cinsinden değerini al ve milisaniyeye çevir
        one_day_in_milliseconds = timedelta(days=1).total_seconds() * 1000

        while is_not_equal_datetime:
            time_dict[tempt_last_date] = []
            if first_timestamp != tempt_last_date:
                tempt_last_date = int(tempt_last_date) - int(one_day_in_milliseconds)

            else:
                is_not_equal_datetime = False
                time_dict[first_timestamp] = []
        veriler = (
            item_event.objects.filter(
                START_DATETIME__gte=first_timestamp,
                START_DATETIME__lt=last_timestampt,
                ITEM_ID=request.data["ITEM_ID"],
                EVENT_TYPE="DOWNTIME",
            )
            .order_by("START_DATETIME")
            .values()
        )
        for item in veriler:
            try:
                time_dict[item["START_DATETIME"]].append(item)
            except:
                tarih_objesi = datetime.utcfromtimestamp(
                    item["START_DATETIME"] / 1000.0
                ).replace(hour=0, minute=0, second=0, microsecond=0)
                time_stamp = int(tarih_objesi.timestamp()) * 1000
                print(item["START_DATETIME"], "------->", time_stamp)
                time_dict[time_stamp].append(item)

        return Response(time_dict)

        # Bu sorgu, belirtilen timestamp'ten büyük veya eşit olan ve aynı ay içindeki tüm verileri getirecektir.
