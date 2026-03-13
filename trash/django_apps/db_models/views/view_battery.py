from rest_framework.viewsets import ModelViewSet
from ..serializers import BatterySerializer
from ..models import Battery


# class CompanyList(ModelViewSet):
class BatteryModelViewSet(ModelViewSet):
    queryset = Battery.objects.all()
    # queryset = Company.objects.root_nodes()
    serializer_class = BatterySerializer
    http_method_names = ["get", "head", "options", "delete", "put", "patch", "post"]
