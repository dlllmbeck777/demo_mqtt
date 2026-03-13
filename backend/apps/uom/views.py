from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from utils.validations import CustomValidationError400
from utils.models_utils import validate_find
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import uom
from .serializers import UomDetailsSerializer, UomSaveUpdateSerializer
import uuid
from apps.uom_base_unit.models import uom_base_unit
from services.parsers.addData.type import typeAddData
from utils.utils import get_info_message, import_data
from services.logging.Handlers import KafkaLogger

logger = KafkaLogger()


class UomSaveView(generics.CreateAPIView):
    serializer_class = UomDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            data["ROW_ID"] = uuid.uuid4().hex
            data["RESULT"] = "(A + (B*X)) / (C + (D*X))"
            instance = uom.objects.create(**data)
            instance.save()
            return Response({"Message": "successful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


# Create your views here.
class UOMScriptView(generics.ListAPIView):
    serializer_class = UomDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            import_data(uom, "uom")
            return Response({"Message": "Succsessfull"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class UomDetialsView(generics.CreateAPIView):
    serializer_class = UomDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            queryset = uom.objects.filter(
                QUANTITY_TYPE=request.data.get("QUANTITY_TYPE")
            )
            serializer = UomDetailsSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class UomDetialsAllView(generics.ListAPIView):
    serializer_class = UomDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset():
        pass

    def get(self, request, *args, **kwargs):
        try:
            queryset = uom.objects.all()
            serializer = UomDetailsSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class UomFilterByTypeView(generics.ListAPIView):
    serializer_class = UomDetailsSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset():
        pass

    def get(self, request, *args, **kwargs):
        try:
            type = kwargs["type"]
            data = []
            queryset = uom.objects.filter(QUANTITY_TYPE=type)
            serializer = UomDetailsSerializer(queryset, many=True)
            base_queryset = uom_base_unit.objects.filter(QUANTITY_TYPE=type)
            base_serializer = UomDetailsSerializer(base_queryset, many=True)
            for item in base_serializer.data:
                item["IS_BASE_UOM"] = True
                data.append(item)
            for item in serializer.data:
                item["IS_BASE_UOM"] = False
                data.append(item)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class UomEditorSaveUpdateView(generics.CreateAPIView):
    serializer_class = UomSaveUpdateSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = UomSaveUpdateSerializer(data=request)
            serializer.is_valid()
            serializer.save(request)
            return Response({"Message": "Succsesful"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class UomDeleteView(generics.CreateAPIView):
    serializer_class = UomSaveUpdateSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            for id in request.data:
                uom.objects.filter(ROW_ID=id).delete()
            msg = get_info_message("UOM.DELETE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            msg = get_info_message("UOM.DELETE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class UomUpdateView(generics.CreateAPIView):
    serializer_class = UomSaveUpdateSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = UomSaveUpdateSerializer(data=request)
            serializer.is_valid()
            serializer.update(request)
            msg = get_info_message("UOM.UPDATE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            msg = get_info_message("UOM.UPDATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class UomCreateView(generics.CreateAPIView):
    serializer_class = UomSaveUpdateSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            serializer = UomSaveUpdateSerializer(data=request)
            serializer.is_valid()
            serializer.create(request)
            msg = get_info_message("UOM.CREATE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            msg = get_info_message("UOM.CREATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class UomDeleteForQTypeView(generics.ListAPIView):
    serializer_class = UomSaveUpdateSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            type = kwargs["type"]
            queryset = uom.objects.filter(QUANTITY_TYPE=type)
            queryset.delete()
            queryset = uom_base_unit.objects.filter(QUANTITY_TYPE=type)
            queryset.delete()
            return Response(
                {"Message": "Successful Delete "}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class GetUomAndBaseUomByCODEView(generics.CreateAPIView):
    serializer_class = UomSaveUpdateSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            culture = request.data["CULTURE"]
            code = request.data["CODE"]
            uoms = uom.objects.filter(CULTURE=culture, CODE=code).values()
            if not uoms:
                uoms = uom_base_unit.objects.filter(CULTURE=culture, CODE=code).values()
            return Response(uoms, status=200)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)
