from django.urls import include, path, re_path
from .views import FeedBackSaveView

urlpatterns = [
    path("create/", FeedBackSaveView.as_view(), name="feedback create"),
]
