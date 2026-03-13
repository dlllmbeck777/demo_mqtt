from datetime import datetime

from utils.validations import CustomValidationError400
from .library import *
import json
from apps.user_settings.models import user_settings
from apps.layer.helpers import change_db
from django.db import connections


class UserInfoUpdateView(generics.GenericAPIView):
    serializer_class = UserModelDepthSerializer
    permission_classes = [IsAuthenticated]

    def update_user(self, request):
        data = json.loads(request.body)
        user = User.objects.filter(email=request.user).update(**data)

        self.serializer_class(user)

    def post(self, request, *args, **kwargs):
        try:
            to_layerDb("STD")
            user = User.objects.filter(email=request.user).first()
            layers = list(user.layer_name.values_list("LAYER_NAME", flat=True))
            for layer_name in layers:
                to_layerDb("STD")
                to_layerDb(layer_name)
                self.update_user(request)
            to_layerDb("STD")
            to_layerDb(request.active_layers)
            msg = get_info_message("PROFILE.UPDATE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            msg = get_info_message("PROFILE.UPDATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )

        # serializer = self.update_user(request)


class UserActiveLayerUpdateView(generics.GenericAPIView):
    serializer_class = UserModelDepthSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            to_layerDb("STD")
            user = User.objects.filter(email=request.user).first()
            find_layer = layer.objects.filter(
                LAYER_NAME=request.data.get("LAYER_NAME")
            ).first()
            user.active_layer = find_layer
            user.save()
            serializer = self.serializer_class(user)
            data = serializer.data
            user = User.objects.filter(email=request.user)[0]
            data["layer_name"] = list(
                user.layer_name.values_list("LAYER_NAME", flat=True)
            )
            data["active_layer"] = user.active_layer.LAYER_NAME

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class UserLayerUpdate(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create_user(self, user, token, layers, role):
        try:
            # print("GİRDİ", layers)
            # to_layerDb(layers)

            now = datetime.now().strftime("%Y-%m-%d")
            user["active_layer_id"] = "STD"
            new_user = User.objects.create(**user)
            Token.objects.create(key=token, created=now, user_id=new_user.id)
            new_user.role = role
            new_user.save()
            row_id = uuid.uuid4().hex
            user_settings.objects.create(USER=new_user, ROW_ID=row_id)
        except Exception as e:
            print(str(e))

    def post(self, request, *args, **kwargs):
        try:
            for value in request.data.get("users"):
                to_layerDb("STD")
                role = roles.objects.filter(
                    LAYER_NAME="STD", ROLES_NAME="Admin"
                ).first()
                user = User.objects.filter(email=value["email"]).values().first()
                token = Token.objects.get(user=user["id"])
                for layers in value["layer_name"]:
                    to_layerDb("STD")
                    active_layer = layer.objects.get(LAYER_NAME=layers)
                    to_layerDb(layers)
                    self.create_user(user, token, layers, role)
                    new_user = User.objects.filter(email=value["email"]).first()
                    layer_names = ["STD", layers]
                    # print(new_user, layers)
                    new_user.active_layer = active_layer
                    new_user.layer_name.set([])
                    new_user.layer_name.set(layer_names)
                    new_user.save()
                    # print("burda hata patlmadıı")

                to_layerDb("STD")
                std_user = User.objects.filter(email=value["email"]).first()
                std_user.layer_name.set([])
                layers = value["layer_name"]
                layers.append("STD")
                std_user.layer_name.set(layers)
                std_user.save()

            # for value in request.data.get("users"):
            #     layers = value.pop("layer_name")
            #     user = (
            #         User.objects.using("default")
            #         .filter(email=value.get("email"))
            #         .first()
            #     )
            #     user.layer_name.set([])
            #     user.layer_name.set(layers)
            #     if value.get("role"):
            #         role = roles.objects.filter(ROLES_ID=value.get("role")).first()
            #         user.role = role
            #     user.save()
            #     user_2 = User.objects.filter(email=value.get("email"))
            #     data = UserChangeDbSerializer(user_2, many=True).data
            #     data = dict(data[0])
            #     token = Token.objects.get(user=user)
            #     try:
            #         for layer in layers:
            #             to_layerDb("STD")
            #             to_layerDb(layer)
            #             test = User.objects.filter(email=value.get("email"))
            #             if test:
            #                 print(test)
            #             else:
            #                 data.pop("id")
            #                 data.pop("active_layer")
            #                 data.pop("groups")
            #                 data.pop("user_permissions")
            #                 role = data.pop("role")
            #                 layer_names = data.pop("layer_name")
            #                 new_user = User.objects.create(**data)
            #                 new_user.role = user.role
            #                 new_user.layer_name.set([])
            #                 new_user.layer_name.set(["STD", layer])
            #                 now = datetime.now().strftime("%Y-%m-%d")
            #                 new_user.save()
            #                 Token.objects.create(
            #                     key=token, created=now, user_id=new_user.id
            #                 )
            #                 print(token)
            # except Exception as e:
            #     print(str(e))

            return Response({"Message": "Succsessful"})
        except Exception as e:
            return Response({"message": f"An error occurred: {str(e)}"}, status=400)


class UserRoleUpdate(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            for value in request.data.get("users"):
                User.objects.filter(email=value.get("email")).update(**value)
            return Response({"Message": "Succsessful"})
        except Exception as e:
            return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserRoleDeleteView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = {}
            data["email"] = request.data.get("email")
            roles_id = roles.objects.filter(LAYER_NAME="STD", ROLES_NAME="User").first()
            data["role_id"] = roles_id
            user = User.objects.filter(email=data.get("email")).update(**data)
            return Response({"Message": "Succsessful"})
        except Exception as e:
            return Response({"Message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
