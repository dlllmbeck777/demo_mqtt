from .es_models import TagsDocument
from .es_serializer import TagsDocumentSimpleSerializer
from rest_framework import permissions
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl.search import Search
from django_elasticsearch_dsl_drf.pagination import PageNumberPagination


class ESBlogViewSet(DocumentViewSet):
    document = TagsDocument
    serializer_class = TagsDocumentSimpleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        name = self.kwargs["name"]
        # print(name)
        s = Search(index="tags")
        s = s.query("match_phrase_prefix", NAME=name)
        s = s.sort({"NAME_ES": {"order": "asc"}})
        s = s.params(size=1000)
        response = s.execute()
        return response.hits
