from django.conf import settings
from django.urls import include, path
from django.contrib import admin
from apps.users import urls
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [

    path("accounts/", include("allauth.urls")),
    path("admin/", admin.site.urls),
    path("api/v1/",include('apps.api.urls'),name = 'api'),
    path("health/", include("health_check.urls")),
    # path("rosetta/", include("rosetta.urls")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

admin.site.site_header = "Ligeia Administration"
admin.site.site_title = "Ligeia"
admin.site.index_title = "Welcome to Ligeia"
admin.site.site_url = "/admin"
