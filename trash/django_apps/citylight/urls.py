from django.urls import include, path, re_path
from smart_selects import urls as smart_selects_urls
from .views import (
        CityList, CityDetail, 
        SubRegionList, SubRegionDetail, 
        RegionList, RegionDetail, 
        CountryList, CountryDetail
    )

urlpatterns = [
    re_path(r'^chaining/', include('smart_selects.urls')),
    re_path(r'^citylight/cities/$', CityList.as_view(), name='cities_light_api_city_list'),
    re_path(r'^citylight/cities/(?P<pk>[^/]+)/$', CityDetail.as_view(), name='cities_light_api_city_detail'),
    re_path(r'^citylight/subregions/$', SubRegionList.as_view(), name='cities_light_api_subregion_list'),
    re_path(r'^citylight/subregions/(?P<pk>[^/]+)/$', SubRegionDetail.as_view(), name='cities_light_api_subregion_detail'),
    re_path(r'^citylight/regions/$', RegionList.as_view(), name='cities_light_api_region_list'),
    re_path(r'^citylight/regions/(?P<pk>[^/]+)/$', RegionDetail.as_view(), name='cities_light_api_region_detail'),
    re_path(r'^citylight/countries/$', CountryList.as_view(), name='cities_light_api_country_list'),
    re_path(r'^citylight/countries/(?P<pk>[^/]+)/$', CountryDetail.as_view(), name='cities_light_api_country_detail'),
]