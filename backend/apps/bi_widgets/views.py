from django.shortcuts import render
from utils.validations import CustomValidationError400
from utils.utils import get_info_message
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import bi_widget
from apps.bi_widget_property.models import bi_widget_property
from .serializers import WidgetSaveSerializer
import uuid
from apps.bi_widget_property.serializers import Widget_PropertySaveSerializer
from rest_framework.response import Response
from django.db import transaction
from apps.bi_dashbord.models import bi_dashboard
from rest_framework.exceptions import ValidationError
from apps.bi_layouts.serializers import LayoutsSerializer

# from .anomalys.get_influx import get_value
# from .anomalys.predict import predicts


# Create your views here.
class WidgetSaveView(generics.CreateAPIView):
    serializer_class = WidgetSaveSerializer
    permission_classes = [permissions.AllowAny]

    def _widgetSave(self, data):
        serializer = WidgetSaveSerializer(data=data)
        if serializer.is_valid():
            widget_prop = serializer.save(data)
            return widget_prop

    def _widgetPropertySave(self, data):
        try:
            for propertys in data:
                serializer = Widget_PropertySaveSerializer(data=propertys)
                serializer.is_valid()
                widget_prop = serializer.save(propertys)
        except Exception as e:
            print(e, "BURDA")

    def _layoutSave(self, widget_id):
        l_types = ["lg", "md", "sm", "xs", "xxs"]
        layout = {"w": 6, "i": widget_id, "h": 6, "x": 0, "y": 999}
        for l_type in l_types:
            layout["l_type"] = l_type
            layout["ROW_ID"] = uuid.uuid4().hex
            serializer = LayoutsSerializer(data=layout)
            serializer.is_valid()
            serializer.save(layout)

    def _dashboardAdd(self, dashboardId, widgetId):
        dash = bi_dashboard.objects.filter(ROW_ID=dashboardId).first()
        if dash:
            dash.WIDGETS.add(widgetId)
            dash.save()
        else:
            raise ValidationError("Dashboard not founds")

    def post(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                widget = self._widgetSave(request.data["WIDGET"])
                widget_id = request.data["WIDGET"].get("WIDGET_ID")
                self._widgetPropertySave(request.data["PROPERTY"])
                self._dashboardAdd(
                    dashboardId=request.data["DASHBOARD_ID"], widgetId=widget_id
                )
                self._layoutSave(widget)
                msg = get_info_message("WIDGET.CREATE.SUCCESS", "en-US")
                return Response(
                    {
                        "status_code": int(str(status.HTTP_200_OK)),
                        "status_message": msg,
                    },
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            msg = get_info_message("WIDGET.CREATE.FAIL", "en-US")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )
        except Exception as e:
            transaction.set_rollback(True)
            msg = get_info_message("WIDGET.CREATE.FAIL", "en-US")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class WidgetDeleteiew(generics.CreateAPIView):
    serializer_class = WidgetSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            qs = bi_widget.objects.filter(**request.data).first()
            if qs:
                widget_id = request.data.get("WIDGET_ID")
                propertys = bi_widget_property.objects.filter(WIDGET_ID=widget_id)
                for prop in propertys:
                    prop.PROPERTY_TAG.clear()
                    prop.WIDGET_ID.clear()
                propertys.delete()
                qs.delete()
                msg = get_info_message("WIDGET.DELETE.SUCCESS")
                return Response(
                    {
                        "status_code": int(str(status.HTTP_200_OK)),
                        "status_message": msg,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                msg = get_info_message("WIDGET.DELETE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )
        except:
            msg = get_info_message("WIDGET.DELETE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


# class WidgetTestView(generics.CreateAPIView):
#     serializer_class = WidgetSaveSerializer
#     permission_classes = [permissions.AllowAny]

#     def post(self, request, *args, **kwargs):
#         import time

#         baslama_zamani = time.time()
#         obj = predicts()

#         tum_veri = get_value(request.data["data"])
#         anomalys = obj.send_db_batch(tum_veri)
#         bitis_zamani = time.time()

#         # Toplam süreyi hesapla
#         calisma_suresi = bitis_zamani - baslama_zamani
#         print(calisma_suresi)
#         return Response(anomalys)
