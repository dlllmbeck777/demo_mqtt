from django.shortcuts import render
from utils.validations import CustomValidationError400
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics, permissions
from rest_framework.response import Response
import uuid
from django.db.models import Q
from rest_framework import status
from .serializers import (
    ResourceTypesDetailsSerializer,
    ResourceTypesSaveSerializer,
    ResourceTypesParentSerializer,
    ResourceTypesUpdateSerializer,
)
from apps.type.models import type as Type
from apps.type.serializers import (
    TypeResourceListManagerSerializer,
    TypeDetailsSerializer,
)

# Create your views here.
from .models import resources_types
from apps.type_link.models import type_link
from apps.type_link.serializers import TypeLinkDetails2Serializer
from services.parsers.addData.type import typeAddData
from utils.models_utils import validate_model_not_null, validate_find
from utils.utils import get_info_message, import_data
from apps.layer.helpers import to_layerDb


class ResourceTypesSaveView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        validate_model_not_null(request.data, "resources_types", request)
        serializer = ResourceTypesSaveSerializer(data=request.data)
        serializer.is_valid()
        serializer.create(request.data)
        return Response({"Message": "successful"}, status=status.HTTP_200_OK)


class ResourceCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = list(request.data)
        try:
            for item in data:
                msg = get_info_message("RESOURCES.CREATE.SUCCESS")
                # validate_model_not_null(request.data, "resources_types", request)
                serializer = ResourceTypesSaveSerializer(data=request.data)
                serializer.is_valid()
                item["LAST_UPDT_USER"] = str(request.user)
                serializer.create(item)

            return Response(
                {
                    "status_code": 200,
                    "status_message": msg,
                }
            )
        except:
            msg = get_info_message("RESOURCES.CREATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class ResourceUpdateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = list(request.data)
        try:
            for item in data:
                msg = get_info_message("RESOURCES.UPDATE.SUCCESS")

                # validate_model_not_null(request.data, "resources_types", request)
                serializer = ResourceTypesUpdateSerializer(data=request.data)
                serializer.is_valid()
                item["LAST_UPDT_USER"] = str(request.user)
                serializer.update(item)
            return Response(
                {
                    "status_code": 200,
                    "status_message": msg,
                }
            )
        except:
            msg = get_info_message("RESOURCES.UPDATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )
        return Response({"Message": "successful"}, status=status.HTTP_200_OK)


class ResourceDeleteView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            for item in request.data:
                resources_types.objects.filter(ROW_ID=item).delete()
            msg = get_info_message("RESOURCES.DELETE.SUCCESS")
            return Response(
                {
                    "status_code": 200,
                    "status_message": msg,
                }
            )
        except:
            msg = get_info_message("RESOURCES.DELETE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class ResourceParentDeleteView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            resources_types.objects.filter(PARENT=request.data["PARENT"]).delete()
            msg = get_info_message("RESOURCES.DELETE.SUCCESS")
            return Response(
                {
                    "status_code": 200,
                    "status_message": msg,
                }
            )
        except:
            msg = get_info_message("RESOURCES.DELETE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class ResourceMessageView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        to_layerDb(kwargs["layer"])
        obj = (
            resources_types.objects.filter(
                ID=request.data["ID"], CULTURE=request.data["CULTURE"]
            )
            .values("SHORT_LABEL", "MOBILE_LABEL")
            .first()
        )

        return Response(
            obj.get("SHORT_LABEL"),
            status=status.HTTP_200_OK,
        )


class ResourceMessageByLayerView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        obj = (
            resources_types.objects.filter(
                ID=request.data["ID"], CULTURE=request.data["CULTURE"]
            )
            .values("SHORT_LABEL", "MOBILE_LABEL")
            .first()
        )
        return Response(obj, status=status.HTTP_200_OK)


class ResourceTypesView(generics.ListAPIView):
    serializer_class = ResourceTypesSaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            import_data(resources_types, "resources_types")
            return Response({"Message": "Succsessfull"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(str(e), "HATA---->")


class ResourceTypesDrawerMenutView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        culture = request.data.get("CULTURE")
        queryset = resources_types.objects.filter(
            ID="drawerMenu", CULTURE=culture, HIDDEN=False
        ).order_by("SORT_ORDER")
        validate_find(queryset, request)
        serializer = ResourceTypesDetailsSerializer(queryset, many=True)
        new_dict = dict()
        self.layers = []
        self._getchild(serializer.data, new_dict, 0, culture)
        return Response(new_dict, status=status.HTTP_200_OK)

    def _getchild(self, data, new_dict, sart, culture):
        for item in data:
            queryset = resources_types.objects.filter(
                ID=item.get("PARENT"), CULTURE=culture, HIDDEN=False
            )
            serializer = ResourceTypesDetailsSerializer(queryset, many=True)
            if queryset:
                tempt = {}
                for value in serializer.data:
                    layer = value.get("PARENT")
                    self.layers.append(layer)
                    if str(layer).split(".")[0] == "TYPE":
                        try:
                            serializer.data.remove(value)
                        except:
                            pass
                        types = layer.split(".")[1]
                        if types == "OG_STD":
                            queryset = Type.objects.filter(LAYER_NAME=types)
                        else:
                            queryset = Type.objects.filter(LABEL_ID=layer)
                        serializer = TypeResourceListManagerSerializer(
                            queryset, many=True
                        )
                        self._getResourceLabel(
                            serializer.data, tempt, value.get("CULTURE"), types
                        )

                    else:
                        tempt[value.get("SHORT_LABEL")] = value
                item["Items"] = tempt

            if sart == 0:
                new_dict[item.get("SHORT_LABEL")] = item
            self._getchild(serializer.data, new_dict, 1, culture)

    def _getResourceLabel(self, data, tempt, culture, types):
        find_type = []
        if types == "OG_STD":
            find_type = self.layers
        for item in data:
            try:
                x = find_type.index(item.get("LABEL_ID"))
            except:
                tempt2 = {}
                queryset = resources_types.objects.filter(
                    ID=item.get("LABEL_ID"), CULTURE=culture, HIDDEN=False
                )
                serializer = ResourceTypesDetailsSerializer(queryset, many=True)
                serializer.data[0]["TYPE"] = item.get("TYPE")
                if item.get("LABEL_ID") == "TYPE.ORG_UNIT2":
                    short_label = serializer.data[0].get("SHORT_LABEL")
                    serializer.data[0]["SHORT_LABEL"] = serializer.data[0].get(
                        "MOBILE_LABEL"
                    )
                    serializer.data[0]["MOBILE_LABEL"] = short_label

                tempt[serializer.data[0].get("SHORT_LABEL")] = serializer.data[0]


class ResourceTypesDetailView(generics.CreateAPIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        queryset = resources_types.objects.filter(ROW_ID=request.data.get("ROW_ID"))
        validate_find(queryset, request)
        serializer = ResourceTypesDetailsSerializer(queryset, many=True)
        return Response(
            {"Message": "successful", "BODY": serializer.data},
            status=status.HTTP_200_OK,
        )


class ResourceTypesEditorTreeMenuView(generics.CreateAPIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        queryset = resources_types.objects.filter(
            CULTURE=request.data.get("CULTURE")
        ).distinct("PARENT")
        validate_find(queryset, request)
        serializer = ResourceTypesDetailsSerializer(queryset, many=True)

        sorted_list = sorted(list(serializer.data), key=lambda d: str(d["PARENT"]))
        return Response(
            sorted_list,
            status=status.HTTP_200_OK,
        )


class ResourceTypesEditorHierarchyView(generics.CreateAPIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        queryset = resources_types.objects.filter(
            CULTURE=request.data.get("CULTURE"), PARENT=request.data.get("PARENT")
        )
        validate_find(queryset, request)
        serializer = ResourceTypesDetailsSerializer(queryset, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class GetScreenLabelInResourceTypesView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        culture = request.data.get("CULTURE")
        ids = request.data.get("ID")
        parent = request.data.get("PARENT")
        queryset = resources_types.objects.filter(
            (Q(CULTURE=culture) & Q(ID__in=ids))
            | (Q(CULTURE=culture) & Q(PARENT__in=parent))
        )
        serializer = ResourceTypesDetailsSerializer(queryset, many=True)
        return_value = {}
        for data in serializer.data:
            return_value[data["ID"]] = data
        return Response(
            return_value,
            status=status.HTTP_200_OK,
        )
