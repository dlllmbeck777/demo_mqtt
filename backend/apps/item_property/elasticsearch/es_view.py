# from .es_models import Item_PropertyDocument
# from .es_serializer import Item_PropertyDocumentSimpleSerializer
# from rest_framework import permissions, status
# from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
# from django_elasticsearch_dsl.search import Search
# from django_elasticsearch_dsl_drf.pagination import PageNumberPagination
# from rest_framework.response import Response


# class ESItem_PropertyViewSet(DocumentViewSet):
#     document = Item_PropertyDocument
#     serializer_class = Item_PropertyDocumentSimpleSerializer
#     permission_classes = [permissions.AllowAny]

#     def post(self, request, *args, **kwargs):
#         PROPERTY_STRING = request.data.get("PROPERTY_STRING")
#         LAYER_NAME = request.data.get("LAYER_NAME")
#         ITEM_TYPE = request.data.get("ITEM_TYPE")
#         s = Search(index="item_property")
#         s = s.query("match_phrase_prefix", PROPERTY_STRING=PROPERTY_STRING)
#         s = s.filter("match", LAYER_NAME=LAYER_NAME)
#         s = s.filter("match", ITEM_TYPE=ITEM_TYPE)
#         s = s.filter("match", PROPERTY_TYPE="NAME")
#         s = s.sort({"PROPERTY_STRING_ES": {"order": "asc"}})
#         s = s.params(size=1000)
#         response = s.execute()
#         serializer = self.get_serializer(response.hits, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def get_queryset(self):
#         return []
