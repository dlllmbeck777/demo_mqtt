from datetime import datetime
from django_elasticsearch_dsl import Document, DateField
from django_elasticsearch_dsl.registries import registry
from django_elasticsearch_dsl import fields
from apps.item_property.models import item_property


@registry.register_document
class Item_PropertyDocument(Document):
    PROPERTY_STRING_ES = fields.KeywordField(attr="PROPERTY_STRING")

    class Index:
        name = "item_property"
        settings = {"number_of_shards": 1, "number_of_replicas": 0}

    class Django:
        model = item_property
        fields = [
            "ITEM_TYPE",
            "PROPERTY_STRING",
            "ITEM_ID",
            "START_DATETIME",
            "LAYER_NAME",
            "PROPERTY_TYPE",
            "ROW_ID",
            "END_DATETIME",
        ]

    def prepare_START_DATETIME(self, instance):
        if type(instance.START_DATETIME) == str:
            instance.START_DATETIME = datetime.strptime(
                instance.START_DATETIME, "%Y-%m-%d"
            ).date()

        return instance.START_DATETIME.strftime("%Y-%m-%d")

    def prepare_END_DATETIME(self, instance):
        if type(instance.END_DATETIME) == str:
            instance.END_DATETIME = datetime.strptime(
                instance.END_DATETIME, "%Y-%m-%d"
            ).date()
        return instance.END_DATETIME.strftime("%Y-%m-%d")
