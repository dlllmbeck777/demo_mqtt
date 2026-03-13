
import django_filters
from cities_light.models import City, SubRegion, Region, Country

class CityFilter(django_filters.FilterSet):
	name_contains = django_filters.CharFilter(field_name='name_ascii', lookup_expr='icontains')
	name_startswith = django_filters.CharFilter(field_name='name_ascii', lookup_expr='istartswith')
	alternate_names_contains = django_filters.CharFilter(field_name="alternate_names", lookup_expr='icontains')
	alternate_names_startswith = django_filters.CharFilter(field_name="alternate_names", lookup_expr='istartswith')
	class Meta:
		model = City
		fields = ['country', 'region', 'subregion', 'name_contains', 'name_startswith']

class SubRegionFilter(django_filters.FilterSet):
	name_contains = django_filters.CharFilter(field_name='name_ascii', lookup_expr='icontains')
	name_startswith = django_filters.CharFilter(field_name='name_ascii', lookup_expr='istartswith')
	alternate_names_contains = django_filters.CharFilter(field_name="alternate_names", lookup_expr='icontains')
	alternate_names_startswith = django_filters.CharFilter(field_name="alternate_names", lookup_expr='istartswith')
	class Meta:
		model = SubRegion
		fields = ['country', 'region', 'name_contains', 'name_startswith']

class RegionFilter(django_filters.FilterSet):
	name_contains = django_filters.CharFilter(field_name='name_ascii', lookup_expr='icontains')
	name_startswith = django_filters.CharFilter(field_name='name_ascii', lookup_expr='istartswith')
	alternate_names_contains = django_filters.CharFilter(field_name="alternate_names", lookup_expr='icontains')
	alternate_names_startswith = django_filters.CharFilter(field_name="alternate_names", lookup_expr='istartswith')
	class Meta:
		model = Region
		fields = ['country', 'name_contains', 'name_startswith']
        
class CountryFilter(django_filters.FilterSet):
	name_contains = django_filters.CharFilter(field_name="name", lookup_expr='icontains')
	name_startswith = django_filters.CharFilter(field_name="name", lookup_expr='istartswith')
	alternate_names_contains = django_filters.CharFilter(field_name="alternate_names", lookup_expr='icontains')
	alternate_names_startswith = django_filters.CharFilter(field_name="alternate_names", lookup_expr='istartswith')
	class Meta:
		model = Country
		fields = ['name_contains', 'name_startswith']