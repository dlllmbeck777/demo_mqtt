from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import WidgetTypeSaveView, WidgetTypeGetView,WidgetTypeScriptView

urlpatterns = [
    path("save/", WidgetTypeSaveView.as_view(), name="widgetTypeSave"),
    path("get/", WidgetTypeGetView.as_view(), name="widgetTypeSave"),
    path("scripts/", WidgetTypeScriptView.as_view(), name="WidgetTypeScriptView"),
]
