from django.urls import path
from apps.parsers.views import add_data

urlpatterns = [
    path("add-data/", add_data),
    # path("temp/", index),
]
