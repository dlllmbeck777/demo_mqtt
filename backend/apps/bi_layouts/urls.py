from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import LayoutsSaveView, LayoutsUpdateView

urlpatterns = [
    path("save/", LayoutsSaveView.as_view(), name="widgetSave"),
    path("update/", LayoutsUpdateView.as_view(), name="widgetUpdate"),
]
