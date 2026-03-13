from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    UomSaveView,
    UOMScriptView,
    UomDetialsView,
    UomEditorSaveUpdateView,
    UomDeleteView,
    UomDetialsAllView,
    UomFilterByTypeView,
    UomCreateView,
    UomUpdateView,
    UomDeleteForQTypeView,
    GetUomAndBaseUomByCODEView,
)

urlpatterns = [
    path("save/", UomSaveView.as_view(), name="UomSave"),
    path("scripts/", UOMScriptView.as_view(), name="Scripts"),
    path("details/", UomDetialsView.as_view(), name="details"),
    path("type/<str:type>/", UomFilterByTypeView.as_view(), name="details"),
    path("details/all", UomDetialsAllView.as_view(), name="details"),
    path("save-update/", UomEditorSaveUpdateView.as_view(), name="save-update"),
    path("delete/", UomDeleteView.as_view(), name="delete"),
    path("create/", UomCreateView.as_view(), name="delete"),
    path("update/", UomUpdateView.as_view(), name="delete"),
    path("delete/quantity/<str:type>/", UomDeleteForQTypeView.as_view(), name="delete"),
    path(
        "get/by/code/",
        GetUomAndBaseUomByCODEView.as_view(),
        name="uoms and uom base unit get by code",
    ),
]
