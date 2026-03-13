from rest_framework.permissions import BasePermission
from .helper import PermissionsHelper
import json


class ItemCreatePermission(BasePermission):
    def __call__(self):
        return self

    def has_permission(self, request, view):
        role = request.role
        data = json.loads(request.body)
        item_type = data["ITEM"]["ITEM_TYPE"]
        return PermissionsHelper(data=role, model_type=item_type, model_method="CREATE")


class CreatePermission(BasePermission):
    def __init__(self, model_type=""):
        self.model_type = model_type

    def __call__(self):
        return self

    def has_permission(self, request, view):
        data = request.role

        return PermissionsHelper(
            data=data, model_type=self.model_type, model_method="CREATE"
        )


class ReadPermission(BasePermission):
    def __init__(self, model_type=""):
        self.model_type = model_type  #

    def __call__(self):
        return self

    def has_permission(self, request, view):
        data = request.role
        # print(data)
        return PermissionsHelper(
            data=data, model_type=self.model_type, model_method="READ"
        )


class UpdatePermission(BasePermission):
    def __init__(self, model_type=""):
        self.model_type = model_type

    def __call__(self):
        return self

    def has_permission(self, request, view):
        data = request.role
        return PermissionsHelper(
            data=data, model_type=self.model_type, model_method="UPDATE"
        )


class DeletePermission(BasePermission):
    def __init__(self, model_type=""):
        self.model_type = model_type

    def __call__(self):
        return self

    def has_permission(self, request, view):
        data = request.role
        return PermissionsHelper(
            data=data, model_type=self.model_type, model_method="DELETE"
        )
