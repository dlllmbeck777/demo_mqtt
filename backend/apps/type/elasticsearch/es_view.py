from .es_models import TypeDocument
from .es_serializer import TypeDocumentSimpleSerializer
from rest_framework import permissions, status
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl.search import Search
from django_elasticsearch_dsl_drf.pagination import PageNumberPagination
from rest_framework.response import Response


class ESTypeViewSet(DocumentViewSet):
    document = TypeDocument
    serializer_class = TypeDocumentSimpleSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        TYPE = request.data.get("TYPE")
        s = Search(index="type")
        s = s.query("match_phrase_prefix", TYPE=TYPE)
        s = s.sort({"TYPE_TEXT_ES": {"order": "asc"}})
        s = s.params(size=1000)
        response = s.execute()
        serializer = self.get_serializer(response.hits, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_queryset(self):
        return []
