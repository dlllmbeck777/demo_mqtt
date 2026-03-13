from django.urls import path
from .consumers import (
    WSLiveConsumer,
    WSConsumerBackfill,
    AlarmsConsumer,
    WSConsumeOnlyLastData,
    ImportTagConsumer,
    WSLiveTabularConsumer,
    TestConsumer,
    WSInkaiAlarmsConsumer,
    WSInkaiNotificationsConsumer,
    WSInkaiWarningsConsumer,
    WSInkaiLogsConsumer,
    WSInkaiUnreadNotificationsConsumer,
    WSInkaiAllNotificationsConsumer,
    WSInkaiLastWarningsConsumer,
    WSInkaiWidgetAlarmsConsumer,
    WSInkaiCommunicationsConsumer,
    WSConsumeTagsStatus,
    # WSAnomalyLiveConsumer,
)

# DataConsumer

websocket_urlpatterns = [
    path(
        "ws/tags/<str:start>/<str:times>/",
        WSLiveConsumer.as_asgi(),
    ),
    # path(
    #     "ws/tags/anomaly/<str:start>/<str:times>/",
    #     WSAnomalyLiveConsumer.as_asgi(),
    # ),
    path(
        "ws/tabular/<str:tag_id>/<str:start>/<str:times>/<str:offset>/",
        WSLiveTabularConsumer.as_asgi(),
    ),
    path("ws/import/<str:types>/", ImportTagConsumer.as_asgi()),
    path(
        "ws/<str:types>/alarms/<str:layer_name>/<str:token>/",
        WSInkaiAlarmsConsumer.as_asgi(),
    ),
    path(
        "ws/communications/<str:layer_name>/<str:token>/",
        WSInkaiCommunicationsConsumer.as_asgi(),
    ),
    path(
        "ws/alarms/<str:layer_name>/<str:type>/<str:token>/",
        WSInkaiWidgetAlarmsConsumer.as_asgi(),
    ),
    path(
        "ws/unread/notifications/<str:layer_name>/",
        WSInkaiUnreadNotificationsConsumer.as_asgi(),
    ),
    path(
        "ws/all/notifications/<str:layer_name>/",
        WSInkaiAllNotificationsConsumer.as_asgi(),
    ),
    path(
        "ws/notifications/<str:layer_name>/<str:token>/",
        WSInkaiNotificationsConsumer.as_asgi(),
    ),
    path("ws/warnings/<str:layer_name>/", WSInkaiWarningsConsumer.as_asgi()),
    path("ws/last/warnings/<str:layer_name>/", WSInkaiLastWarningsConsumer.as_asgi()),
    path("ws/logs/<str:layer_name>/", WSInkaiLogsConsumer.as_asgi()),
    path("ws/live/last_data/<str:times>/", WSConsumeOnlyLastData.as_asgi()),
    path("ws/tags/backfill/<str:tag_id>", WSConsumerBackfill.as_asgi()),
    path("ws/tags/field/status/<str:uuid>/", WSConsumeTagsStatus.as_asgi()),
    # path(
    #     "ws/tags/measurement/anomaly/<str:layer_name>/<str:uuid>/",
    #     WSInkaiAnomalyConsumer.as_asgi(),
    # ),
]
