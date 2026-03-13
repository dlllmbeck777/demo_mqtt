from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    ItemView,
    ItemSaveView,
    ItemDetailsView,
    ItemDeleteView,
    ItemUpdateView,
    ItemCreateView,
    Item2View,
)

urlpatterns = [
    path("save/", ItemSaveView.as_view(), name="ItemSaveView"),
    # path("item-and-property/", ItemScriptSaveView.as_view(), name="ItemScriptSaveView"),
    path("delete/", ItemDeleteView.as_view(), name="ItemDeleteView"),
    path("scripts/", ItemView.as_view(), name="ItemView"),
    path("test/", Item2View.as_view(), name="ItemView"),
    path("details/<str:item>", ItemDetailsView.as_view(), name="ItemDetailsView"),
    path("create/", ItemCreateView.as_view(), name="ItemCreateView"),
    path("update/", ItemUpdateView.as_view(), name="ItemUpdateView"),
]
