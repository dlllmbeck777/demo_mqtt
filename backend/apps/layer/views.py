from datetime import datetime
import importlib
import uuid
from django.shortcuts import render
from apps.code_list.models import code_list
from rest_framework import generics, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from services.parsers.addData.type import typeAddData
from utils.utils import get_info_message, redisCaching as Red
from apps.users.models import User
from utils.models_utils import (
    validate_model_not_null,
    validate_find,
)
from apps.user_settings.models import user_settings
from apps.users.serializers import LayerUserRegistrationSerializer
from utils.utils import import_data
from apps.users.helpers import generate_random_password, send_forget_password_mail
from utils.validations import CustomValidationError400
from .helpers import (
    create_database,
    getDefaultDBSettings,
    deleteDB,
    to_layerDb,
    change_db,
)
from apps.roles.models import roles
from .tasks import async_create_database, async_delete_database
from .models import layer
from .serializers import (
    LayerSaveSerializer,
    LayerDropDownSerializer,
)
from rest_framework.authtoken.models import Token


class LayerDropDownView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return

    def get(self, request, *args, **kwargs):
        queryset = list(layer.objects.values_list("LAYER_NAME", flat=True))
        return Response(
            queryset,
            status=status.HTTP_200_OK,
        )


class LayerSaveView(generics.CreateAPIView):
    serializer_class = LayerSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = self.updateData(request)
            validate_model_not_null(data, "LAYER", request=request)
            serializer = LayerSaveSerializer(data=data)
            serializer.is_valid()
            serializer.create(data)
            # create_database(request.data, **request.data.get("DB_SETTINGS"))
            async_create_database(
                request.data,
            )
            to_layerDb("STD")
            msg = get_info_message("LAYER.CREATE.SUCCESS")
            return Response(
                {
                    "status_code": 200,
                    "status_message": msg,
                }
            )

        except Exception as e:
            print(str(e))
            msg = get_info_message("LAYER.CREATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )

    def updateData(self, request):
        db_settings = getDefaultDBSettings()
        db_settings.update(request.data.get("DB_SETTINGS"))
        data = request.data
        data["DB_SETTINGS"] = db_settings
        data["LAST_UPDT_USER"] = str(request.user)
        data["ROW_ID"] = uuid.uuid4().hex
        data["VERSION"] = uuid.uuid4().hex
        data["LAST_UPDT_DATE"] = datetime.now().timestamp()
        return data


class LayerUpdateView(generics.CreateAPIView):
    serializer_class = LayerSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = self.updateData(request)
            serializer = LayerSaveSerializer(data=data)
            serializer.is_valid()
            serializer.update(data)
            msg = get_info_message("LAYER.UPDATE.SUCCESS")
            return Response(
                {
                    "status_code": 200,
                    "status_message": msg,
                }
            )

        except:
            msg = get_info_message("LAYER.UPDATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )

    def updateData(self, request):
        data = request.data
        data["LAST_UPDT_USER"] = str(request.user)
        data["LAST_UPDT_DATE"] = datetime.now().strftime("%Y-%m-%d")
        return data


class LayerView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        import_data(layer, "layer")
        return Response({"Message": "Successful"}, status=status.HTTP_200_OK)


class LayerTreeMenuView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            qs = layer.objects.exclude(LAYER_NAME="STD").values("LAYER_NAME", "ROW_ID")
            return Response(qs)
        except Exception as e:
            return Response({"status": str(e)})


class LayerUserSelectBoxView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            qs = layer.objects.exclude(LAYER_NAME="STD").values_list(
                "LAYER_NAME", flat=True
            )
            return Response(qs)
        except Exception as e:
            return Response({"status": str(e)})


class LayerTreeMenuDetailsView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            qs = layer.objects.filter(ROW_ID=request.data.get("ROW_ID")).values()
            return Response(qs)
        except Exception as e:
            return Response({"status": str(e)})


class LayerModelViewSet(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        queryset = layer.objects.filter(ROW_ID=request.data.get("ROW_ID"))
        validate_find(queryset)
        serializer = LayerSaveSerializer(data=queryset, many=True)
        serializer.is_valid()
        return Response(
            {"Message": "Successful", "BODY": serializer.data},
            status=status.HTTP_200_OK,
        )


class LayerDeleteView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            change_db("default")
            qs = layer.objects.filter(ROW_ID=request.data.get("ROW_ID"))
            # print(qs)
            if qs:
                layer_info = qs.values("LAYER_NAME", "DB_SETTINGS")
                layer_name = layer_info[0].get("LAYER_NAME")
                db_settings = layer_info[0].get("DB_SETTINGS")
                async_delete_database(layer_name, db_settings)
                qs.delete()
                msg = get_info_message("LAYER.DELETE.SUCCESS")
                return Response(
                    {
                        "status_code": 200,
                        "status_message": msg,
                    }
                )
            else:
                msg = get_info_message("LAYER.DELETE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )

        except:
            msg = get_info_message("LAYER.DELETE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class LayerUserRegisterView(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = LayerUserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        try:
            to_layerDb("STD")
            data = request.data
            layer_name = (
                User.objects.filter(email=request.user).first().active_layer.LAYER_NAME
            )
            data["password"] = generate_random_password()
            subject = "Your Account"
            message = f"Your password assigned by us: {data['password']}"
            token = ""
            layer_names = ["STD", layer_name]
            role = data.pop("role")
            token = self.create_user(layer_names, data, token, "STD", role)
            to_layerDb(layer_name)
            token = self.create_user(
                layer_names, data, token, active_layer=layer_name, role=role
            )
            msg = get_info_message("USER.CREATE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            msg = get_info_message("USER.CREATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )

    def create_user(
        self, layer_names="", data="", token="", active_layer="STD", role=""
    ):
        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            user = User.objects.create(**data)
            user.layer_name.set(["STD"])
            user.active_layer = layer.objects.get(LAYER_NAME=active_layer)
            user.role = roles.objects.get(ROLES_ID=role)
            print(data)
            user.set_password(data["password"])
            user.save()
            # print(token,"----> token")
            users = User.objects.filter(email=data["email"]).first()
            row_id = uuid.uuid4().hex
            user_settings.objects.create(USER=user, ROW_ID=row_id)
            users.layer_name.set([])
            users.layer_name.set(layer_names)
            if token != "":
                now = datetime.now().strftime("%Y-%m-%d")
                Token.objects.create(key=token, created=now, user_id=users.id)
            else:
                print("TOKEN BURAYA GİRDİ")
                token = Token.objects.create(user=user)
        return token
