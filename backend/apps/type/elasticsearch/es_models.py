from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry
from apps.type.models import type as Type
from django_elasticsearch_dsl import fields


@registry.register_document
class TypeDocument(Document):
    TYPE_TEXT_ES = fields.KeywordField(attr="TYPE")

    class Index:
        name = "type"
        settings = {"number_of_shards": 1, "number_of_replicas": 0}

    class Django:
        model = Type
        fields = ["TYPE", "BASE_TYPE", "ROW_ID", "LABEL_ID", "LAYER_NAME", "HIDDEN"]
