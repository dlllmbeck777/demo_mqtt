import uuid

from rest_framework import serializers

from utils.models_utils import validate_model_not_null, validate_value
from rest_framework.exceptions import ValidationError
from .models import type_link


class TypeLinkSaveSerializer(serializers.Serializer):
    def save(self, validated_data):
        qs = type_link.objects.filter(ROW_ID=validated_data.get("ROW_ID"))
        if qs:
            try:
                validate_value(validated_data, "TYPE_LINK")
                qs.update(**validated_data)
            except Exception as e:
                raise ValidationError(e)
        else:
            try:
                validate_model_not_null(validated_data, "TYPE_LINK")
                validated_data["VERSION"] = uuid.uuid4().hex
                codeList = type_link.objects.create(**validated_data)
                codeList.save()
                return codeList
            except Exception as e:
                raise ValidationError(e)


class TypeLinkDetails2Serializer(serializers.ModelSerializer):
    class Meta:
        model = type_link
        fields = "__all__"


class TypeLinkDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = type_link
        fields = [
            "TYPE",
            "FROM_TYPE",
            "FROM_CARDINALITY",
            "TO_TYPE",
            "TO_CARDINALITY",
            "ROW_ID",
        ]
