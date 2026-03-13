from django.urls import path

from .views import base_views

urlpatterns = [
    path(r'', base_views.ProtectedDataView.as_view(), name='protected_data'),
]
