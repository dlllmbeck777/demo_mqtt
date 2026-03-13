from django.urls import include, path, re_path
from .views import (
    ResourceTypesSaveView,
    ResourceTypesView,
    ResourceTypesDetailView,
    ResourceTypesDrawerMenutView,
    ResourceTypesEditorTreeMenuView,
    ResourceTypesEditorHierarchyView,
    ResourceCreateView,
    ResourceUpdateView,
    ResourceDeleteView,
    ResourceParentDeleteView,
    ResourceMessageView,
    ResourceMessageByLayerView,
    GetScreenLabelInResourceTypesView,
)
from django.urls.resolvers import URLPattern

# from .elasticsearch.es_view import ESResourceTypesViewSet

# from .userViews import ResourceTypesUserDrawerMenutView,DrawerView


urlpatterns = [
    path("save/", ResourceTypesSaveView.as_view(), name="code-list-save"),
    path("create/", ResourceCreateView.as_view(), name="create"),
    path("update/", ResourceUpdateView.as_view(), name="update"),
    path("delete/", ResourceDeleteView.as_view(), name="delete childs"),
    path("delete/parent/", ResourceParentDeleteView.as_view(), name="delete parent"),
    path("scripts/", ResourceTypesView.as_view(), name="code-list"),
    path("details/", ResourceTypesDetailView.as_view(), name="clDetails"),
    path("menu/", ResourceTypesDrawerMenutView.as_view(), name="clDetails"),
    # path("menu/user/", ResourceTypesUserDrawerMenutView.as_view(), name="clDetails"),
    path("parent/", ResourceTypesEditorTreeMenuView.as_view(), name="parent"),
    path("message/<str:layer>/", ResourceMessageView.as_view(), name="layer message "),
    path("get/label/", ResourceMessageByLayerView.as_view(), name="layer message "),
    path("get/", ResourceTypesEditorHierarchyView.as_view(), name="hierarchy"),
    # path("es/", ESResourceTypesViewSet.as_view({"get": "list"}), name=""),
    # path("menu/", DrawerView.as_view(), name="test"),
    path(
        "get/<str:screen>/",
        GetScreenLabelInResourceTypesView.as_view(),
        name="hierarchy",
    ),
]
