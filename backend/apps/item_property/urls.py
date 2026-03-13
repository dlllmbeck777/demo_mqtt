from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    ItemPropertyScriptSaveView,
    ItemPropertyView,
    ItemPropertyDetailsView,
    ItemPropertyDeleteView,
    ItemGetRPMValueView,
    ItemPropertysColumnDeleteView,
)

# from .elasticsearch.es_view import ESItem_PropertyViewSet

urlpatterns = [
    path("save/", ItemPropertyScriptSaveView.as_view(), name="item-prop-save"),
    path("scripts/", ItemPropertyView.as_view(), name="item-prop-script"),
    path("details/", ItemPropertyDetailsView.as_view(), name="typeDetails"),
    path("delete/", ItemPropertyDeleteView.as_view(), name="typeDelete"),
    path("get/rpm/<str:layer>/", ItemGetRPMValueView.as_view(), name="typeDelete"),
    path("delete/columns/", ItemPropertysColumnDeleteView.as_view(), name="typeDelete"),
    # path("es/", ESItem_PropertyViewSet.as_view({"get": "list"}), name=""),
]
