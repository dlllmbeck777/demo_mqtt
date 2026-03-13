from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    TypePropertyDetailView,
    TypePropertySaveView,
    TypePropertyEditorSaveView,
    TypePropertyView,
    TypeDeleteView
)

urlpatterns = [
    path("save/", TypePropertySaveView.as_view(), name="PropertySave"),
    path("save-update/", TypePropertyEditorSaveView.as_view(), name="PropertyUpdate"),
    path("scripts/", TypePropertyView.as_view(), name="PropertyScript"),
    path("details/", TypePropertyDetailView.as_view(), name="PropertyDetails"),
    path("delete/", TypeDeleteView.as_view(), name="PropertyDelete"),
]

