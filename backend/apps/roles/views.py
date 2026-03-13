from django.shortcuts import render
from utils.validations import CustomValidationError400
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import (
    RolesSaveSerializer,
    RolesSaveAndUpdatePropertySaveSerializer,
    RolesPropertySerializer,
)
from .models import roles
from apps.roles_property.models import roles_property
from apps.roles_property.serializers import RolesPropertySaveSerializer
from django.db import transaction
from utils.models_utils import (
    validate_find,
)
from utils.utils import get_info_message, import_data


class RolesSaveView(generics.GenericAPIView):
    serializer_class = RolesSaveAndUpdatePropertySaveSerializer
    permission_classes = [permissions.AllowAny]

    def save_roles(self, request):
        data = request.data.get("ROLES")
        data["PROPERTY_ID"] = self.property_list
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save(data)

    def save_rolesProperty(self, request):
        for props in request.data.get("PROPERTY"):
            self.property_list.append(props.get("ROW_ID"))
            serializer = RolesPropertySaveSerializer(data=props)
            if serializer.is_valid():
                serializer.save(props)

    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            self.property_list = []
            self.save_rolesProperty(request)
            try:
                # print(self.property_list)
                self.save_roles(request)
                msg = get_info_message("ROLE.UPDATE.SUCCESS")
                return Response(
                    {
                        "status_code": 200,
                        "status_message": msg,
                    }
                )

            except Exception as e:
                print(str(e))
                transaction.set_rollback(True)
                msg = get_info_message("ROLE.UPDATE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )


class RolesScriptView(generics.GenericAPIView):
    serializer_class = RolesPropertySaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        message = import_data(roles, "roles", is_relationship=True)
        return Response({"Message": "message"}, status=status.HTTP_200_OK)


class RolesGetView(generics.GenericAPIView):
    serializer_class = RolesSaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            queryset = roles.objects.all().order_by("ROLES_NAME")
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)


class RolesDeleteView(generics.GenericAPIView):
    serializer_class = RolesSaveAndUpdatePropertySaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            roles_id = request.data.get("ROLES_ID")
            queryset = roles.objects.get(ROLES_ID=roles_id)
            validate_find(queryset, request)
            try:
                roles_property.objects.filter(roles=roles_id).delete()
                queryset.PROPERTY_ID.remove()
                queryset.delete()
                msg = get_info_message("ROLE.DELETE.SUCCESS")
                return Response(
                    {
                        "status_code": 200,
                        "status_message": msg,
                    }
                )

            except Exception as e:
                transaction.set_rollback(True)
                msg = get_info_message("ROLE.DELETE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )


class RolesGetPropertyView(generics.GenericAPIView):
    serializer_class = RolesPropertySaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            roles_id = request.data.get("ROLES_ID")
            # print(roles_id)
            queryset = roles_property.objects.filter(roles=roles_id, PARENT=None)
            serializer = RolesPropertySaveSerializer(queryset, many=True)
            self.get_child(serializer.data, roles_id)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

    def get_child(self, data, roles_id):
        for item in data:
            prop = roles_property.objects.filter(
                roles=roles_id, PARENT=item["ROLES_TYPES"]
            )
            child_data = RolesPropertySaveSerializer(prop, many=True).data
            self.get_child(child_data, roles_id)
            item["CHILD"] = child_data


class RolesGetNamePropertyByIDView(generics.GenericAPIView):
    serializer_class = RolesPropertySaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            roles_id = request.data.get("ROLES_ID")
            queryset = (
                roles.objects.filter(ROLES_ID=roles_id).values("ROLES_NAME").first()
            )
            return Response(queryset)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
