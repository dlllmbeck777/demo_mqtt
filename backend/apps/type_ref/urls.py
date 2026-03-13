from django.urls import include, path, re_path
from django.urls.resolvers import URLPattern
from .views import (
    GetTransactionsReadRefByItemView,
    GetTypeRefByItemView,
    GetTypeRefByItemIdView,
)

urlpatterns = [
    path("get/<str:item>/read/", GetTransactionsReadRefByItemView.as_view()),
    path("get/<str:item>/transactions/", GetTypeRefByItemView.as_view()),
    path("get/<str:item_id>/", GetTypeRefByItemIdView.as_view()),
]
