import uuid

from rest_framework import serializers
from utils.models_utils import validate_model_not_null, validate_value
from rest_framework.exceptions import ValidationError
from .models import tags
from services.logging.Handlers import KafkaLogger

logger = KafkaLogger()


class TagsImportFileSerializer(serializers.Serializer):
    files = serializers.FileField()


class TagsSaveSerializer(serializers.Serializer):
    def save(self, validated_data):  #
        qs = tags.objects.filter(TAG_ID=validated_data.get("TAG_ID"))
        if qs:
            qs.update(**validated_data)
        else:
            tagss = tags.objects.create(**validated_data)
            tagss.save()
        return "Succsessful"
        # return super().create(validated_data)


class TagsDetiailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = tags
        fields = ["NAME", "TAG_ID"]


class TagsUomConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = tags
        fields = [
            "NAME",
            "TAG_ID",
            "UOM_QUANTITY_TYPE",
            "UOM_NAME",
        ]


class TagsNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = tags
        fields = [
            "ITEM_ID",
            "TAG_ID",
            "NAME",
            "UOM",
            "UOM_QUANTITY_TYPE",
            "UOM_NAME",
            "NORMAL_MAXIMUM",
            "NORMAL_MINIMUM",
            "ROW_ID",
            "TRANSACTION_TYPE",
            "TRANSACTION_PROPERTY",
        ]


class TagsFieldsSerializer(serializers.ModelSerializer):
    class Meta:
        model = tags
        fields = "__all__"
