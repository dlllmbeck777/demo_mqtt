from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import WidgetSaveView, WidgetDeleteiew  # WidgetTestView

urlpatterns = [
    path("save/", WidgetSaveView.as_view(), name="widgetSave"),
    path("delete/", WidgetDeleteiew.as_view(), name="widgetDelete"),
]
