from django.urls import include, path, re_path
from .views import (
    ItemEventStateSaveView,
    ItemEventGetStateView,
    ItemEventSaveView,
    ItemEventGetDowntimeView,
    ItemEventUpdateView,
    ItemEventDeleteView,
    ItemEventGetDowntimeBLView,
    ItemEventKeysView,
    ItemEventGetStateAllColumnsView,
    ItemEventGetPaginationsDowntimeView,
    ItemEventTSDowntimeView,
)
from django.urls.resolvers import URLPattern

urlpatterns = [
    path(
        "save/status/", ItemEventStateSaveView.as_view(), name="item event save status"
    ),
    path("get/", ItemEventGetStateView.as_view(), name="item event get status"),
    path("get/dt/", ItemEventTSDowntimeView.as_view(), name="item event get status"),
    path(
        "get/columns/all/",
        ItemEventGetStateAllColumnsView.as_view(),
        name="item event get status",
    ),
    path(
        "get/downtime/",
        ItemEventGetDowntimeView.as_view(),
        name="item event get status",
    ),
    path(
        "get/downtime/paginations/<str:culture>/<str:item_id>/<str:event_type>/<str:page_size>/",
        ItemEventGetPaginationsDowntimeView.as_view(),
        name="item event get status",
    ),
    path(
        "get/downtime/<str:layer>/",
        ItemEventGetDowntimeBLView.as_view(),
        name="item event get status",
    ),
    path(
        "update/",
        ItemEventUpdateView.as_view(),
        name="item event update",
    ),
    path(
        "delete/",
        ItemEventDeleteView.as_view(),
        name="item event delete",
    ),
    path("save/", ItemEventSaveView.as_view(), name="item event save"),
    path("test/test/", ItemEventKeysView.as_view(), name="item event save"),
]
