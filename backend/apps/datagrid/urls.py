from django.urls import include, path, re_path

from .views import LoaderSaveModelData
from django.urls.resolvers import URLPattern

urlpatterns = [
    path("save/", LoaderSaveModelData.as_view(), name="layert-save"),
]
