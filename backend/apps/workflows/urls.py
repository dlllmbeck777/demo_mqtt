from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    WorkFlowsCreateView,
    WorkFlowsDeleteView,
    WorkFlowsUpdateView,
    WorkFlowsGetView,
    WorkFlowsGetByIdView,
)

urlpatterns = [
    path("create/", WorkFlowsCreateView.as_view(), name="create "),
    path("update/", WorkFlowsUpdateView.as_view(), name="update "),
    path("delete/", WorkFlowsDeleteView.as_view(), name="delete "),
    path("get/", WorkFlowsGetView.as_view(), name="get "),
    path("get/<str:row_id>/", WorkFlowsGetByIdView.as_view(), name="get by id "),
]
