from datetime import datetime
import uuid

from apps.user_settings.models import user_settings
from .base_model import ModelImporter
from django.db import transaction
from apps.roles.models import roles
from apps.layer.models import layer
from apps.layer.helpers import to_layerDb
from apps.users.helpers import generate_random_password
from apps.users.models import User
from rest_framework.authtoken.models import Token


class UsersDataGrid(ModelImporter):
    def get_model(self):
        from apps.users.models import User

        return User

    def update_obj(self, data):
        for item in data:
            to_layerDb("STD")

            layer_names = item["layer_name"]
            try:
                layer_names.remove("STD")
            except:
                pass
            std_user = User.objects.filter(email=item["email"]).first()
            user_password = (
                User.objects.filter(email=item["email"]).values("password").first()
            ).get("password")
            std_token = Token.objects.filter(user=std_user).first()
            print(std_token)

            layers_name = ["STD"]
            for layers in item["layer_name"]:
                layers_name.append(layers)

            std_user.layer_name.set(layers_name)
            for layers in layer_names:
                to_layerDb("STD")
                to_layerDb(layers)
                layer_user = User.objects.filter(email=item["email"]).first()
                if layer_user:
                    layer_user.role = roles.objects.filter(
                        ROLES_ID=item["role"]
                    ).first()
                    layer_user.save()
                else:
                    user_layers = item.pop("layer_name")
                    user_role = item.pop("role")
                    print(user_role)
                    item.pop("active_layer")
                    item["password"] = user_password
                    # print(token,"----> token")
                    row_id = uuid.uuid4().hex
                    layer_user = User.objects.create(**item)
                    user_setting_obj = user_settings.objects.filter(USER=layer_user)
                    if not user_setting_obj:
                        user_settings.objects.create(USER=layer_user, ROW_ID=row_id)
                    layer_user.role = roles.objects.filter(ROLES_ID=user_role).first()
                    layer_user.active_layer = layer.objects.filter(
                        LAYER_NAME=layers
                    ).first()
                    layer_user.layer_name.set(layers_name)
                    now = datetime.now().strftime("%Y-%m-%d")
                    Token.objects.create(key=std_token, created=now, user_id=item["id"])
                    print("yeni kullanıcı layerde oluştu")

                    # token = self.create_user(layer_names,data,token,active_layer=layer_name)

    def create_obj(self, data):
        with transaction.atomic():
            try:
                for item in data:
                    self.get_model().objects.create(**item)
            except Exception as e:
                print(str(e))
                transaction.set_rollback(True)
                # msg = get_info_message("WIDGET.CREATE.FAIL")
                # raise CustomValidationError400(
                #     detail={"status_code": 400, "status_message": msg}
                # )

    def delete_obj(self, data):
        with transaction.atomic():
            try:
                for item in data:
                    self.get_model().objects.filter(id=item).delete()
            except Exception as e:
                print(str(e))
                transaction.set_rollback(True)
