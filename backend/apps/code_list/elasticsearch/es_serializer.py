from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from .es_models import CodeListDocument


class CodeListDocumentSimpleSerializer(DocumentSerializer):
    class Meta:
        document = CodeListDocument
        fields = "__all__"
