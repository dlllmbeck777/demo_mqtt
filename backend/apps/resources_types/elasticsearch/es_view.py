# from .es_models import ResourceTypesDocument
# from .es_serializer import ResourceTypesDocumentSimpleSerializer
# from rest_framework import permissions, status
# from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
# from django_elasticsearch_dsl.search import Search
# from django_elasticsearch_dsl_drf.pagination import PageNumberPagination
# from rest_framework.response import Response


# class ESResourceTypesViewSet(DocumentViewSet):
#     document = ResourceTypesDocument
#     serializer_class = ResourceTypesDocumentSimpleSerializer
#     permission_classes = [permissions.AllowAny]

#     def post(self, request, *args, **kwargs):
#         label = request.data.get("PARENT")
#         culture = request.data.get("CULTURE")
#         s = Search(index="resources_types")
#         s = s.query("match_phrase_prefix", PARENT=label)
#         s = s.filter("match", CULTURE=culture)
#         s = s.params(size=1000)
#         response = s.execute()
#         unique_hits = []
#         unique_parent_values = set()
#         for hit in response.hits:
#             if hit["PARENT"] not in unique_parent_values:
#                 unique_parent_values.add(hit["PARENT"])
#                 unique_hits.append(hit)
#         serializer = self.get_serializer(unique_hits, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
