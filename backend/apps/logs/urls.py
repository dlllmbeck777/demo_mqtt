from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern
from .views import GetAllLogsWithPaginationsView

urlpatterns = [
    path(
        "get/paginations/",
        GetAllLogsWithPaginationsView.as_view(),
        name="Get logs with paginations",
    )
]
