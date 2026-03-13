from django.shortcuts import render
from utils.utils import import_data
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import RolesTypeSaveSerializer
from .models import roles_type
from apps.type.models import type as Type
from apps.resources_types.models import resources_types
from apps.type.serializers import TypeResourceListManagerSerializer


class RolesTypeSaveView(generics.GenericAPIView):
    serializer_class = RolesTypeSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            roles_type = serializer.save()
            return Response(
                {
                    "Message": "Succsessful",
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RolesTypeGetView(generics.GenericAPIView):
    serializer_class = RolesTypeSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            culture = request.data["CULTURE"]
            queryset = roles_type.objects.filter(PARENT=None)
            # print(queryset)
            serializer = self.get_serializer(queryset, many=True)
            self.get_child(serializer.data, culture)
            return Response(serializer.data)
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

    def get_child(self, data, culture):
        for item in data:
            child_queryset = roles_type.objects.filter(PARENT=item["ROLES_TYPES"])
            child_serializer = self.get_serializer(child_queryset, many=True)
            self.get_child(child_serializer.data, culture)
            item["CHILD"] = child_serializer.data
            if item["ROLES_TYPES"] == "ITEMS":
                child = []
                types = Type.objects.filter(TYPE_CLASS="ITEM")
                type_serializer = TypeResourceListManagerSerializer(types, many=True)
                for type_id in type_serializer.data:
                    items_role_types = {
                        "CREATE": False,
                        "READ": False,
                        "UPDATE": False,
                        "DELETE": False,
                    }
                    labels = resources_types.objects.filter(
                        ID=type_id["LABEL_ID"], CULTURE=culture
                    ).values("SHORT_LABEL", "MOBILE_LABEL")[0]
                    items_role_types["ROLES_TYPES"] = type_id["TYPE"]
                    if labels["SHORT_LABEL"]:
                        items_role_types["ROLES_INFO"] = labels["SHORT_LABEL"]
                    else:
                        items_role_types["ROLES_INFO"] = labels["MOBILE_LABEL"]
                    items_role_types["PARENT"] = "ITEMS"
                    child.append(items_role_types)
                item["CHILD"] = child


class RolesTypeScriptView(generics.GenericAPIView):
    serializer_class = RolesTypeSaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        message = import_data(
            roles_type,
            "roles_type",
        )
        return Response({"Message": message}, status=status.HTTP_200_OK)
