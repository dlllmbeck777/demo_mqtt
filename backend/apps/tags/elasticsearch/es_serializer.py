from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from .es_models import TagsDocument


class TagsDocumentSimpleSerializer(DocumentSerializer):
    class Meta:
        document = TagsDocument
        fields = "__all__"
