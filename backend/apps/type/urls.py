from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    TypeAndPropertySaveView,
    TypeSaveView,
    TypeDetailNewView,
    TypeEditorBaseView,
    TypeEditorSaveView,
    TypeEditorPropertyView,
    TypeView,
    TypeDeleteView,
    TypeWorkflowView,
    GetTypeView,
)

# from .elasticsearch.es_view import ESTypeViewSet


urlpatterns = [
    path("save/", TypeSaveView.as_view(), name="typeSave"),
    path(
        "save-property/", TypeAndPropertySaveView.as_view(), name="typeAndPropertySave"
    ),
    path("delete/", TypeDeleteView.as_view(), name="typeDelete"),
    path("scripts/", TypeView.as_view(), name="type"),
    path("details/", TypeDetailNewView.as_view(), name="typeDetails"),
    path("all/", TypeEditorBaseView.as_view(), name="typeallDetails"),
    path("editor/", TypeEditorPropertyView.as_view(), name="typeEditor"),
    path("save-editor/", TypeEditorSaveView.as_view(), name="typeEditorSave"),
    path("workflows/", TypeWorkflowView.as_view(), name="workflows"),
    # path("detailsold/",TypeDetailView.as_view() ,name='typeDetails'),#TypeDetailView.as_view()
    # path("es/", ESTypeViewSet.as_view({"get": "list"}), name=""),
    path("get/types/", GetTypeView.as_view(), name=""),
]
