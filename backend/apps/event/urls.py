from django.urls import include, path, re_path
from .views import (
    MongoUpdateUnReadNotifications,
    AlarmsNotificationsView,
    GetAllAlarmsWithPaginationsView,
)
from django.urls.resolvers import URLPattern

urlpatterns = [
    path(
        "update/<str:status>/",
        MongoUpdateUnReadNotifications.as_view(),
        name="update notifications",
    ),
    path("get/", AlarmsNotificationsView.as_view(), name=" By DB NAME"),
    path(
        "get/paginations/",
        GetAllAlarmsWithPaginationsView.as_view(),
        name="alerts or notifications",
    ),
]
