from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from .es_models import Item_PropertyDocument


class Item_PropertyDocumentSimpleSerializer(DocumentSerializer):
    class Meta:
        document = Item_PropertyDocument
        fields = "__all__"
