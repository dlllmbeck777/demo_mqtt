from django.shortcuts import render
from utils.utils import get_info_message
from utils.validations import CustomValidationError400
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import bi_widget_property
from .serializers import (
    Widget_PropertySaveSerializer,
    Widget_PropertyGetSerializer,
    Widget_PropertyUpdateSerializer,
)
import uuid
from rest_framework.response import Response
from django.db import transaction
from apps.uom.models import uom
from apps.uom_base_unit.models import uom_base_unit


# Create your views here.
class WidgetPropertySaveView(generics.CreateAPIView):
    serializer_class = Widget_PropertySaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = Widget_PropertySaveSerializer(data=request.data)
        if serializer.is_valid():
            widget_prop = serializer.save(request.data)
            message = Widget_PropertySaveSerializer(widget_prop).data
            return Response(message, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WidgetPropertyGetView(generics.CreateAPIView):
    serializer_class = Widget_PropertyGetSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        qs = bi_widget_property.objects.filter(WIDGET_ID=request.data.get("WIDGET_ID"))
        self.culture = request.data["CULTURE"]
        serializer = Widget_PropertyGetSerializer(qs, many=True)
        new_dict = {}
        for item in serializer.data:
            i = 0
            key = item.get("PROPERTY_NAME")
            if item.get("PROPERTY_JSON"):
                new_dict[key] = item.get("PROPERTY_JSON")
                i = 1
            if item.get("PROPERTY_TAG"):
                for values in item.get("PROPERTY_TAG"):
                    self.get_tags_uom(values)
                new_dict[key] = item.get("PROPERTY_TAG")
                i = 1
            if item.get("PROPERTY_TAG_CAL"):
                if item.get("PROPERTY_TAG"):
                    for values in item.get("PROPERTY_TAG_CAL"):
                        self.get_tags_uom(values)
                        new_dict[key].append(values)
                else:
                    for values in item.get("PROPERTY_TAG_CAL"):
                        self.get_tags_uom(values)
                    new_dict[key] = item.get("PROPERTY_TAG_CAL")
                i = 1
            if item.get("PROPERTY_BOOLEAN") is not None:
                i = 1
                new_dict[key] = item.get("PROPERTY_BOOLEAN")
            if i == 0:
                new_dict[key] = item.get("PROPERTY_STRING")
        return Response(new_dict, status=status.HTTP_201_CREATED)

    def get_tags_uom(self, data):
        obj = (
            uom.objects.filter(CODE=data["UOM_CODE"], CULTURE=self.culture)
            .values("NAME", "QUANTITY_TYPE", "CATALOG_SYMBOL")
            .first()
        )
        if not obj:
            obj = (
                uom_base_unit.objects.filter(
                    CODE=data["UOM_CODE"], CULTURE=self.culture
                )
                .values("NAME", "QUANTITY_TYPE", "CATALOG_SYMBOL")
                .first()
            )
        if obj:
            obj["UOM_NAME"] = obj.pop("NAME")
            data.update(obj)


class WidgetPropertyUpdateView(generics.CreateAPIView):
    serializer_class = Widget_PropertyUpdateSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            try:
                for property in request.data["UPDATE"]:
                    serializer = Widget_PropertyUpdateSerializer(data=property)
                    serializer.is_valid()
                    serializer.save(property)
                for deleteItem in request.data["DELETE"]:
                    widgetId = deleteItem.get("WIDGET_ID")
                    propertyName = deleteItem.get("PROPERTY_NAME")
                    qs = (
                        bi_widget_property.objects.filter(
                            WIDGET_ID=widgetId, PROPERTY_NAME=propertyName
                        )
                        .first()
                        .delete()
                    )
                msg = get_info_message("WIDGET.UPDATE.SUCCESS")
                return Response(
                    {
                        "status_code": int(str(status.HTTP_200_OK)),
                        "status_message": msg,
                    },
                    status=status.HTTP_200_OK,
                )
            except Exception as e:
                transaction.set_rollback(True)
                msg = get_info_message("WIDGET.UPDATE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )

            return Response({"Message": "Succsesful"}, status=status.HTTP_200_OK)
