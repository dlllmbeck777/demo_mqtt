from rest_framework.viewsets import ModelViewSet
from ..serializers import FieldSerializer
from ..models import Field


# class CompanyList(ModelViewSet):
class FieldView(ModelViewSet):
    queryset = Field.objects.all()
    serializer_class = FieldSerializer
    http_method_names = ["get", "head", "options", "delete", "put", "patch", "post"]
