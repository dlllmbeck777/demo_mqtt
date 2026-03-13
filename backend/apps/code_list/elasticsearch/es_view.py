from .es_models import CodeListDocument
from .es_serializer import CodeListDocumentSimpleSerializer
from rest_framework import permissions, status
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl.search import Search
from django_elasticsearch_dsl_drf.pagination import PageNumberPagination
from rest_framework.response import Response


class ESCodeListViewSet(DocumentViewSet):
    document = CodeListDocument
    serializer_class = CodeListDocumentSimpleSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        code_text = request.data.get("CODE_TEXT")
        culture = request.data.get("CULTURE")
        s = Search(index="code_list")
        s = s.query("match_phrase_prefix", CODE_TEXT=code_text)
        s = s.filter("match", CULTURE=culture)
        s = s.filter("match", LIST_TYPE="CODE_LIST")
        s = s.sort({"CODE_TEXT_ES": {"order": "asc"}})
        s = s.params(size=1000)
        response = s.execute()
        serializer = self.get_serializer(response.hits, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_queryset(self):
        return []
