from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern

from .views import (
    DashBoardsView,
    DashBoardsSaveView,
    DashBoardsDeleteView,
    DashBoardsDublicateView,
    DashBoardsGetUserView,
    DashBoardsUpdateUserView,
    DashBoardsCopyView,
    DashBoardsDeleteAllView,
)

urlpatterns = [
    path("get/", DashBoardsView.as_view(), name="dashBoardList"),
    path("user/get/", DashBoardsGetUserView.as_view(), name="dashBoardList"),
    path("user/update/", DashBoardsUpdateUserView.as_view(), name="dashBoardList"),
    path("save/", DashBoardsSaveView.as_view(), name="dashBoardSave"),
    path("delete/", DashBoardsDeleteView.as_view(), name="dashBoardDelete"),
    path("deleteAll/", DashBoardsDeleteAllView.as_view(), name="dashBoardDelete"),
    path("dublicate/", DashBoardsDublicateView.as_view(), name="dashBoardDelete"),
    path("copy/", DashBoardsCopyView.as_view(), name="dashBoardDelete"),
]
