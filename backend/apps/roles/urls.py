from django.urls import include, path, re_path
from .views import (
    RolesSaveView,
    RolesGetView,
    RolesDeleteView,
    RolesGetPropertyView,
    RolesScriptView,
    RolesGetNamePropertyByIDView,
)
from django.urls.resolvers import URLPattern


urlpatterns = [
    path("save/", RolesSaveView.as_view(), name="RolesSaveView"),
    path("get/", RolesGetView.as_view(), name="RolesGetView"),
    path("scripts/", RolesScriptView.as_view(), name="RolesScriptView"),
    path("get/property/", RolesGetPropertyView.as_view(), name="RolesGetPropertyView"),
    path("delete/", RolesDeleteView.as_view(), name="RolesDeleteView"),
    path("get/name/", RolesGetNamePropertyByIDView.as_view(), name="RolesDeleteView"),
]
