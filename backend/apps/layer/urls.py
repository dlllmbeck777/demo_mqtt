from django.urls import include, path, re_path
from .views import (
    LayerView,
    LayerSaveView,
    LayerModelViewSet,
    LayerDropDownView,
    LayerTreeMenuView,
    LayerUpdateView,
    LayerTreeMenuDetailsView,
    LayerDeleteView,
    LayerUserRegisterView,
    LayerUserSelectBoxView,
)
from django.urls.resolvers import URLPattern

urlpatterns = [
    path("create/", LayerSaveView.as_view(), name="layert-save"),
    path("user/create/", LayerUserRegisterView.as_view(), name="register user"),
    path("update/", LayerUpdateView.as_view(), name="layert-save"),
    path("scripts/", LayerView.as_view(), name="layer-scripts"),
    path("details/", LayerModelViewSet.as_view(), name="layer-list"),
    path("treemenu/", LayerTreeMenuView.as_view(), name="layer-list"),
    path("get/all/", LayerUserSelectBoxView.as_view(), name="layer-list"),
    path("treemenu/details/", LayerTreeMenuDetailsView.as_view(), name="layer-list"),
    path("delete/", LayerDeleteView.as_view(), name="layer-list"),
    path("layer-dropdown/", LayerDropDownView.as_view(), name="layer-dropdown"),
]
