from rest_framework import viewsets, generics
from restapi.serializers import typeProductList, typeProductDetail 
from db_dictionaries.models._type_product import Type_product

class typeProductList(generics.ListAPIView):
    queryset = Type_product.objects.root_nodes()
    serializer_class = typeProductList

class typeProductDetail(generics.ListAPIView):
    queryset = Type_product.objects.all()
    serializer_class = typeProductDetail
