from django.urls.resolvers import URLPattern
from django.urls import include, path, re_path

from .views import gelAllSettingsByUser, updateSettingsByUser, getStateSettingsByUser

urlpatterns = [
    path("get/all/", gelAllSettingsByUser.as_view(), name="getAll"),
    path("get/state/", getStateSettingsByUser.as_view(), name="getState"),
    path("update/", updateSettingsByUser.as_view(), name="update"),
]
