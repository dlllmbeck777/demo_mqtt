from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    WidgetPropertySaveView,
    WidgetPropertyGetView,
    WidgetPropertyUpdateView,
)

urlpatterns = [
    path("save/", WidgetPropertySaveView.as_view(), name="widgetPropertySave"),
    path("get/", WidgetPropertyGetView.as_view(), name="widgetPropertyGet"),
    path("update/", WidgetPropertyUpdateView.as_view(), name="widgetPropertyUpdate"),
]
