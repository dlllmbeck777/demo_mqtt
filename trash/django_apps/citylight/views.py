from django.shortcuts import render

from rest_framework import generics
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from cities_light.models import City, SubRegion, Region, Country
from .filters import CityFilter, SubRegionFilter, RegionFilter, CountryFilter
from .serializers import ( CitySerializer, SubRegionSerializer, RegionSerializer, CountrySerializer)

class CityList(generics.ListAPIView):
    """API endpoint listing cities"""
    # model = City
    queryset = City.objects.all()
    serializer_class = CitySerializer
    filter_backends = [DjangoFilterBackend]
    filter_class = CityFilter

class CityDetail(generics.RetrieveAPIView):
    """API endpoint retrieving a single city"""
    # model = City
    queryset = City.objects.all()
    serializer_class = CitySerializer

class SubRegionList(generics.ListAPIView):
    """API endpoint listing regions"""
    # model = Region
    queryset = SubRegion.objects.all()
    serializer_class = SubRegionSerializer
    filter_backends = [DjangoFilterBackend]
    filter_class = SubRegionFilter

class SubRegionDetail(generics.RetrieveAPIView):
    """API endpoint retrieving a single region"""
    model = SubRegion
    queryset = SubRegion.objects.all()
    serializer_class = SubRegionSerializer

class RegionList(generics.ListAPIView):
    """API endpoint listing regions"""
    # model = Region
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    filter_backends = [DjangoFilterBackend]
    filter_class = RegionFilter

class RegionDetail(generics.RetrieveAPIView):
    """API endpoint retrieving a single region"""
    model = Region
    queryset = Region.objects.all()
    serializer_class = RegionSerializer

class CountryList(generics.ListAPIView):
    """API endpoint listing countries"""
    # model = Country
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    filter_backends = [DjangoFilterBackend]
    filter_class = CountryFilter
    
class CountryDetail(generics.RetrieveAPIView):
    """API endpoint retrieving a single country"""
    model = Country
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
