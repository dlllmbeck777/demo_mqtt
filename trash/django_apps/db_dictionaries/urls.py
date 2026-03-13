
from rest_framework.routers import DefaultRouter

from .views import (
    CompanyView
)

routers = DefaultRouter()

routers.register('company', CompanyView, basename='company')


urlpatterns = [ ]

urlpatterns += routers.urls