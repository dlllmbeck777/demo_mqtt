from django.urls import include, path, re_path
from .views import ResourceDrawerMenuView, ResourceDrawerScriptView

urlpatterns = [
    # path("get/<str:culture>/", ResourceDrawerSaveView.as_view(), name="a"),
    path("get/<str:culture>/", ResourceDrawerMenuView.as_view(), name="a"),
    path(
        "scripts/", ResourceDrawerScriptView.as_view(), name="ResourceDrawerScriptView"
    ),
]
