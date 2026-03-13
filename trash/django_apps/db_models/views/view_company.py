from rest_framework.viewsets import ModelViewSet
from ..serializers import CompanySerializer
from ..models import Company


# class CompanyList(ModelViewSet):
class CompanyView(ModelViewSet):
    queryset = Company.objects.all()    
    serializer_class = CompanySerializer
    http_method_names = ["get", "head", "options", "delete", "put", "patch", "post"]
