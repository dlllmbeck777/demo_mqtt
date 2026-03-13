from django.shortcuts import render
from utils.models_utils import validate_find
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import uom_base_unit
from .serializers import (
    UomUnitDetailsSerializer,
    UomUnitQuantitySerializer,
    BaseUOMSaveUpdateSerializer,
)
import uuid
from django.db.models import Q
from apps.uom.models import uom
from apps.uom.serializers import UomQuantitySerializer, UomDetailsSerializer
from services.parsers.addData.type import typeAddData
from utils.utils import import_data
from services.logging.Handlers import KafkaLogger

logger = KafkaLogger()


class UomUnitSaveView(generics.CreateAPIView):
    serializer_class = UomUnitDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            data["ROW_ID"] = uuid.uuid4().hex
            instance = uom_base_unit.objects.create(**data)
            instance.save()

            return Response({"Message": "successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class UomUnitScriptView(generics.ListAPIView):
    serializer_class = UomUnitDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            import_data(uom_base_unit, "uom_base_unit")

            return Response({"Message": "Succsessfull"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class UomUnitDetailView(generics.CreateAPIView):
    serializer_class = UomUnitDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            queryset = uom_base_unit.objects.filter(
                QUANTITY_TYPE=request.data.get("QUANTITY_TYPE")
            )
            serializer = UomUnitDetailsSerializer(queryset, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class UomUnitAllDetailsView(generics.ListAPIView):
    serializer_class = UomUnitDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            queryset = uom_base_unit.objects.all()
            serializer = UomUnitDetailsSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class UomQuantityTypeDetailView(generics.CreateAPIView):
    serializer_class = UomUnitQuantitySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        pass

    def post(self, request, *args, **kyawargs):
        try:
            distinct_qtypes = (
                uom.objects.filter(CULTURE=request.data["CULTURE"])
                .values("QUANTITY_TYPE")
                .distinct()
                .order_by("QUANTITY_TYPE")
            )
            distinct_qtypes = distinct_qtypes.union(
                uom_base_unit.objects.filter(CULTURE=request.data["CULTURE"])
                .values("QUANTITY_TYPE")
                .distinct()
            ).order_by("QUANTITY_TYPE")

            return Response(distinct_qtypes, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class UomUnitsNameView(generics.CreateAPIView):
    serializer_class = UomUnitDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            querysetBaseUom = uom_base_unit.objects.filter(
                Q(QUANTITY_TYPE=request.data.get("QUANTITY_TYPE")),
                ~Q(CATALOG_SYMBOL="(Deprecated)"),
            ).distinct("CATALOG_SYMBOL")
            querysetUoms = uom.objects.filter(
                Q(QUANTITY_TYPE=request.data.get("QUANTITY_TYPE")),
                ~Q(CATALOG_SYMBOL="(Deprecated)"),
            ).distinct("CATALOG_SYMBOL")
            serializerBaseUom = UomUnitDetailsSerializer(querysetBaseUom, many=True)
            serializerUoms = UomDetailsSerializer(querysetUoms, many=True)
            data = list(serializerBaseUom.data) + list(serializerUoms.data)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class BaseUomEditorSaveUpdateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = BaseUOMSaveUpdateSerializer(data=request)
            serializer.is_valid()
            serializer.save(request)
            return Response({"Message": "Succsesful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class BaseUomDeleteView(generics.CreateAPIView):
    serializer_classes = UomUnitDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            queryset = uom_base_unit.objects.filter(ROW_ID=request.data.get("ROW_ID"))
            validate_find(queryset, request)
            queryset.delete()
            return Response(
                {"Message": "Successful Delete "}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)
