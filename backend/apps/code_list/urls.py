from django.urls import include, path, re_path
from .views import (
    CodeListSaveScriptView,
    CodeListView,
    CodeListDetailView,
    CodeListDeleteView,
    CodeListDeepDetailView,
    CodeListParentDeleteView,
    CodeListSaveAndUpdateView,
    CodeListDeleteChildView,
    CodeListSaveAndUpdateNewView,
    CodeListCultureView,
    CodeListParentView,
    CodeListTypeDetailView,
    CodeListWIDGET_TYPEView,
    CodeListUpdateView,
    CodeListLayerDbEngineView,
    CodeListLayerDbView,
    CodeListLanguageSettingsView,
    CodeListGetByRequestView,
)

# from .elasticsearch.es_view import ESCodeListViewSet
from django.urls.resolvers import URLPattern

urlpatterns = [
    # path("codelistchild/",CodeListSaveView.as_view(),name='code-list-and-child-create'),
    path("save/", CodeListSaveScriptView.as_view(), name="code-list-save"),
    path("update/", CodeListUpdateView.as_view(), name="code-list-save"),
    path("culture/", CodeListCultureView.as_view(), name="code-list-culture"),
    path(
        "save-update/",
        CodeListSaveAndUpdateView.as_view(),
        name="code-list-save-update",
    ),
    path(
        "save-update-new/",
        CodeListSaveAndUpdateNewView.as_view(),
        name="code-list-save-update",
    ),
    path("scripts/", CodeListView.as_view(), name="code-list"),
    path("details/", CodeListDetailView.as_view(), name="clDetails"),
    path("details/parent/", CodeListParentView.as_view(), name="clDetailsParent"),
    path("layer/db/", CodeListLayerDbView.as_view(), name="layer db models"),
    path(
        "layer/db/engine/<str:code>/<str:culture>/",
        CodeListLayerDbEngineView.as_view(),
        name="layer db model engine",
    ),
    path("deep-details/", CodeListDeepDetailView.as_view(), name="clDetails"),
    path(
        "delete-child/",
        CodeListDeleteChildView.as_view(),
        name="code-list-delete-child",
    ),
    path("delete/", CodeListDeleteView.as_view(), name="code-list-delete-child"),
    path(
        "delete-parent/",
        CodeListParentDeleteView.as_view(),
        name="code-list-delete-parent",
    ),
    path("property-code/", CodeListTypeDetailView.as_view(), name="PropertyCode"),
    path("widget-type/", CodeListWIDGET_TYPEView.as_view(), name="PropertyCode"),
    path("get/by/request/", CodeListGetByRequestView.as_view(), name="PropertyCode"),
    # path("es/", ESCodeListViewSet.as_view({"get": "list"}), name=""),
    # LANGUAGE
    path(
        "get/language/settings/<str:culture>/",
        CodeListLanguageSettingsView.as_view(),
        name="PropertyCode",
    ),
]
