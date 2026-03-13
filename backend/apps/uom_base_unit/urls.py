from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    UomUnitSaveView,
    UomUnitScriptView,
    UomUnitAllDetailsView,
    UomUnitDetailView,
    UomUnitsNameView,
    UomQuantityTypeDetailView,
    BaseUomEditorSaveUpdateView,
    BaseUomDeleteView,
)

urlpatterns = [
    path("save/", UomUnitSaveView.as_view(), name="UomSave"),
    path("detail/", UomUnitDetailView.as_view(), name="detail"),
    path("details/", UomUnitAllDetailsView.as_view(), name="details"),
    path("scripts/", UomUnitScriptView.as_view(), name="Scripts"),
    path("type/", UomQuantityTypeDetailView.as_view(), name="type"),
    path("name/", UomUnitsNameView.as_view(), name="name"),
    path("save-update/", BaseUomEditorSaveUpdateView.as_view(), name="save-update"),
    path("delete/", BaseUomDeleteView.as_view(), name="delete"),
]
