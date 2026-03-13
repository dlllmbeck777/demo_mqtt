from rest_framework.routers import DefaultRouter

from .views import (
    # CompanyView,
    # FieldView,
    BatteryModelViewSet,
)

routers = DefaultRouter()

# routers.register("company", CompanyView, basename="company")
# routers.register("field", FieldView, basename="field")
routers.register("battery", views=BatteryModelViewSet, basename="battery:ModelViewSet")

urlpatterns = []

urlpatterns += routers.urls
