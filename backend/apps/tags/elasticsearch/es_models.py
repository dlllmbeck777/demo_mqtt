from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry
from apps.tags.models import tags
from django_elasticsearch_dsl import fields


@registry.register_document
class TagsDocument(Document):
    NAME_ES = fields.KeywordField(attr="NAME")

    class Index:
        name = "tags"
        settings = {"number_of_shards": 1, "number_of_replicas": 0}

    class Django:
        model = tags
        fields = ["TAG_ID", "NAME", "DESCRIPTION", "UOM", "UOM_QUANTITY_TYPE"]
