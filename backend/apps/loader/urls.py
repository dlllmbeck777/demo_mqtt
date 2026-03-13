from django.urls import include, path, re_path

from .views import LoaderReturnFileData, LoaderSaveModelData
from django.urls.resolvers import URLPattern

urlpatterns = [
    path("get/", LoaderReturnFileData.as_view(), name="layert-save"),
    path("create/", LoaderSaveModelData.as_view(), name="layert-save"),
]
