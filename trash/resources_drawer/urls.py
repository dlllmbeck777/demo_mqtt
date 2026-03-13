from django.urls import include, path, re_path
from .views import (
    ResourceDrawerSaveView,
    ResourceDrawerScriptView,
    DrawerView,
)


urlpatterns = [
    path("save/", ResourceDrawerSaveView.as_view(), name="ResourceDrawerSaveView"),
    path(
        "scripts/", ResourceDrawerScriptView.as_view(), name="ResourceDrawerScriptView"
    ),
    path("menu/", DrawerView.as_view(), name="DrawerView"),
]
