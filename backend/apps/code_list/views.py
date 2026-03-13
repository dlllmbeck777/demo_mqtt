import uuid
import couchdb
from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from apps.templates.orm_CodeList import CodeListORM
from services.logging.Handlers import KafkaLogger
from services.parsers.addData.type import typeAddData
from utils.utils import redisCaching as Red

# Create your views here.
from .models import code_list
from .serializers import (
    CodeListDetailsSerializer,
    CodeListCustomSerializer,
    CodeListSaveSerializer,
    CodeListDeleteSerializer,
    CodeListCustomNewSerializer,
)
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from utils.models_utils import (
    validate_model_not_null,
    null_value_to_space,
    validate_find,
)

from utils.utils import import_data
from utils.permissions.admin import (
    CreatePermission,
    ReadPermission,
    UpdatePermission,
    DeletePermission,
)

create_per = CreatePermission(model_type="CODE_LST")
read_per = ReadPermission(model_type="CODE_LST")
update_per = UpdatePermission(model_type="CODE_LST")
delete_per = DeletePermission(model_type="CODE_LST")
logger = KafkaLogger()
from utils.utils import get_info_message


class CodeListSaveScriptView(generics.CreateAPIView):
    authentication_classes = ()
    permission_classes = [permissions.AllowAny, create_per]
    serializer_class = CodeListSaveSerializer

    def create(self, request, *args, **kwargs):
        del request.data["HIERARCHY"]
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(request.data)
        msg = get_info_message("CODELIST.CREATE.SUCCESS")
        data = {"status_code": 200, "status_message": msg}
        return Response(data, status=status.HTTP_200_OK)


class CodeListUpdateView(generics.CreateAPIView):
    authentication_classes = ()
    permission_classes = [permissions.AllowAny, update_per]
    serializer_class = CodeListSaveSerializer

    def post(self, request, *args, **kwargs):
        del request.data["HIERARCHY"]
        serializer = CodeListSaveSerializer(data=request.data)
        serializer.is_valid()
        serializer.save(request.data)
        msg = get_info_message("CODELIST.UPDATE.SUCCESS")
        data = {"status_code": 200, "status_message": msg}
        # Red.delete(str(request.user) + request.data.get("HIERARCHY")[0])
        return Response(data, status=status.HTTP_200_OK)


class CodeListSaveAndUpdateNewView(generics.UpdateAPIView):
    permission_classes = [permissions.AllowAny]

    def put(self, request, *args, **kwargs):
        serializer = CodeListCustomNewSerializer(data=request.data)
        serializer.is_valid()
        message = serializer.save(request)
        Red.delete(str(request.user) + request.data.get("HIERARCHY")[0])
        return Response({"Message": "message"}, status=status.HTTP_200_OK)


class CodeListSaveAndUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.AllowAny]

    def put(self, request, *args, **kwargs):
        serializer = CodeListCustomSerializer(data=request.data)
        Red.delete(str(request.user) + request.data.get("HIERARCHY")[0])
        serializer.is_valid()
        message = serializer.save(request)

        return Response({"Message": message}, status=status.HTTP_200_OK)


class CodeListCultureView(generics.ListAPIView):
    permission_classes = [
        permissions.AllowAny,
    ]

    def get(self, request, *args, **kwargs):
        queryset = code_list.objects.filter(LIST_TYPE="CULTURES")
        serializer = CodeListDetailsSerializer(queryset, many=True)
        return Response({"Message": serializer.data}, status=status.HTTP_200_OK)


class CodeListWIDGET_TYPEView(generics.ListAPIView):
    serializer_class = CodeListSaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        queryset = (
            code_list.objects.filter(LIST_TYPE="WIDGET_TYPE")
            .order_by("CODE_TEXT")
            .values()
        )
        return Response(queryset, status=status.HTTP_200_OK)


class CodeListView(generics.ListAPIView):
    serializer_class = CodeListSaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        import_data(code_list, "code_list")

        return Response({"Message": "successful"}, status=status.HTTP_200_OK)


from apps.layer.helpers import change_db
from django.db.models import Q
import importlib


class CodeListLayerDbView(generics.CreateAPIView):
    serializer_class = CodeListSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            queryset = code_list.objects.filter(
                Q(LIST_TYPE="DB"), Q(CULTURE=request.data["CULTURE"]), ~Q(CODE="IMAGES")
            ).values("CODE_TEXT", "CHAR1", "CHAR2", "ROW_ID", "CODE")
        except Exception as e:
            print(str(e))
        return Response(queryset, status=status.HTTP_200_OK)


class CodeListLayerDbEngineView(generics.ListAPIView):
    serializer_class = CodeListSaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        change_db("default")
        """The models variable retrieves the parent records of the data that has the DB Code.
            A for loop checks the status of these records based on their char1 and char2 values,
            and returns the status."""

        models = code_list.objects.filter(
            PARENT=kwargs["code"], CULTURE=kwargs["culture"]
        ).values("CODE_TEXT", "CHAR1", "CHAR2", "VAL1")
        for model in models:
            modul_path, modul_name = model.pop("CHAR1").split(",")
            module_import = importlib.import_module(modul_path)
            functions = getattr(module_import, modul_name)
            response_value = False
            if functions:
                response_value = functions()
                model["status"] = response_value
                model["HOST"] = model.pop("CODE_TEXT")
                model["ENGINE"] = model.pop("CHAR2")
                model["PORT"] = int(model.pop("VAL1"))
        return Response(models, status=status.HTTP_200_OK)


class CodeListParentView(generics.CreateAPIView):
    serializer_class = CodeListDetailsSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [read_per]

    def post(self, request, *args, **kwargs):
        list_types = "CODE_LIST"
        culture = request.data.get("CULTURE")
        # print(request.user)
        cache_key = str(request.user) + list_types + culture
        queryset = code_list.objects.filter(
            LIST_TYPE=list_types,
            CULTURE=culture,
        ).order_by("CODE_TEXT")
        validate_find(queryset, request=request)
        serializer = CodeListDetailsSerializer(queryset, many=True)
        serializer = null_value_to_space(serializer.data, request=request)
        # sorted_list = sorted(list(serializer), key=lambda d: d["CODE_TEXT"])
        Red.set(cache_key, serializer)
        return Response(serializer, status=status.HTTP_200_OK)


class CodeListDetailView(generics.CreateAPIView):
    serializer_class = CodeListDetailsSerializer
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        if request.data.get("ROW_ID"):
            cache_key = str(request.user) + request.data.get("ROW_ID")

        cache_data = Red.get(cache_key)

        if cache_data:
            return Response(cache_data, status=status.HTTP_200_OK)

        queryset = code_list.objects.filter(
            ROW_ID=request.data.get("ROW_ID"),
        )

        validate_find(queryset, request=request)
        serializer = CodeListDetailsSerializer(queryset, many=True)
        serializer = null_value_to_space(serializer.data, request=request)
        # Red.set(cache_key, serializer)
        return Response(serializer, status=status.HTTP_200_OK)


class CodeListDeleteChildView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        message = "Codelist deletion successful"
        try:
            rowIdList = request.data.get("ROW_ID")
            for value in rowIdList:
                queryset = code_list.objects.filter(ROW_ID=value)
                validate_find(queryset, request=request)
                queryset.delete()
                Red.delete(request.data + value)
            return Response(message, status=status.HTTP_200_OK)
        except Exception as e:
            raise ValidationError(e)


class CodeListParentDeleteView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        message = "Codelist Parent deletion successful"
        try:
            queryset = code_list.objects.filter(ROW_ID=request.data.get("ROW_ID"))
            validate_find(queryset, request=request)

            serializer = CodeListDeleteSerializer(queryset, many=True)
            list_types = serializer.data[0].get("LIST_TYPE")
            culture = serializer.data[0].get("CULTURE")
            cache_key = str(request.user) + list_types + culture
            self._delete_child(serializer.data)
            Red.delete(str(request.user) + request.data.get("ROW_ID"))
            Red.delete(cache_key)
            return Response(message, status=status.HTTP_200_OK)
        except Exception as e:
            raise ValidationError(e)

    def _delete_child(self, data):
        for item in data:
            queryset = code_list.objects.filter(ROW_ID=item.get("ROW_ID"))
            serializer = CodeListDetailsSerializer(queryset, many=True)
            child_data = serializer.data
            queryset.delete()
            CodeListORM.getCodeList()
        return True


class CodeListDeleteView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny, delete_per]

    def post(self, request, *args, **kwargs):
        try:
            code_list.objects.filter(ROW_ID=request.data["ROW_ID"]).delete()
            msg = get_info_message("CODELIST.DELETE.SUCCESS", request.data["CULTURE"])
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e))
            msg = get_info_message("CODELIST.DELETE.FAIL", request.data["CULTURE"])
            data = {"status_code": 400, "status_message": msg}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)


class CodeListDeepDetailView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny, read_per]

    def post(self, request, *args, **kwargs):
        cache_key = (
            str(request.user) + request.data.get("CODE") + request.data.get("CULTURE")
        )
        cache_data = Red.get(cache_key)
        if cache_data:
            return Response(cache_data, status=status.HTTP_200_OK)

        queryset = code_list.objects.filter(
            CODE=request.data.get("CODE"), CULTURE=request.data.get("CULTURE")
        )
        validate_find(queryset, request)
        serializer = CodeListDetailsSerializer(queryset, many=True)
        respons_value = []
        culture = serializer.data[0].get("CULTURE")
        respons_value = CodeListORM.getCodeList(
            queryset, culture=culture, hierarchy=True
        )
        # respons_value = null_value_to_space(respons_value, request)
        # Red.set(cache_key, respons_value)
        # print(respons_value)
        return Response(respons_value, status=status.HTTP_200_OK)

    # def _get_child(self, data,respons_value,index,parent):
    #     for item in data:
    #         childItem = []
    #         if parent is not None:
    #             for data in parent:
    #                 childItem.append(data)

    #         childItem.append(item.get('ROW_ID'))

    #         item['HIERARCHY'] = childItem

    #         if index == 0:
    #             respons_value.append(item)

    #         queryset = code_list.objects.filter(
    #                 LIST_TYPE=item.get("CODE"),
    #                 CULTURE=item.get("CULTURE")
    #             )
    #         serializer = CodeListDetailsSerializer(queryset, many=True)
    #         self._get_child(serializer.data,respons_value,1,childItem)
    #     return respons_value

    # def _get_child(self, data,respons_value,index,parent):
    #     print(respons_value)
    #     for item in data:

    #         childItem = []
    #         if parent is not None :
    #             childItem.append(parent)
    #         if index == 1:
    #             childItem.append(item.get('ROW_ID'))

    #         item['HIERARCHY'] = childItem
    #         if item.get('LIST_TYPE') != 'CODE_LIST':
    #             respons_value.append(item)

    #         if index == 0:
    #             respons_value.append(item)
    #         queryset = code_list.objects.filter(
    #         LIST_TYPE=item.get("CODE"), CULTURE=item.get("CULTURE")
    #         )
    #         serializer = CodeListDetailsSerializer(queryset, many=True)
    #         self._get_child(serializer.data,respons_value,1,childItem[0])
    #     return respons_value


class CodeListTypeDetailView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        culture = request.data.get("CULTURE")
        queryset = code_list.objects.filter(
            LIST_TYPE=request.data.get("CODE_LIST"), CULTURE=culture
        )
        child_code = CodeListORM.getCodeList(queryset, culture=culture, hierarchy=False)
        for item in child_code:
            if item["CODE"] == "Null":
                # print(item)
                pass
        return Response(child_code, status=status.HTTP_200_OK)


# LANGUAGE


class CodeListLanguageSettingsView(generics.CreateAPIView):
    serializer_class = CodeListSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        culture = kwargs["culture"]
        queryset = (
            code_list.objects.filter(PARENT__in=request.data["PARENT"], CULTURE=culture)
            .values()
            .order_by("VAL1")
        )
        for item in queryset:
            item["CHILD"] = (
                code_list.objects.filter(LIST_TYPE=item["CODE"], CULTURE=culture)
                .order_by("VAL1")
                .values()
            )

        return Response(queryset, status=status.HTTP_200_OK)


class CodeListGetByRequestView(generics.CreateAPIView):
    serializer_class = CodeListSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        return Response(
            code_list.objects.filter(**request.data).values(),
            status=status.HTTP_200_OK,
        )
