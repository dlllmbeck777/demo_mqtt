from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from .es_models import TypeDocument


class TypeDocumentSimpleSerializer(DocumentSerializer):
    class Meta:
        document = TypeDocument
        fields = "__all__"
