import uuid

from rest_framework import serializers

from .models import type_property
from utils.models_utils import validate_model_not_null, validate_value
from rest_framework.exceptions import ValidationError

from services.logging.Handlers import KafkaLogger

logger = KafkaLogger()


class TypePropertySaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = type_property
        fields = "__all__"


class TypePropertyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = type_property
        fields = "__all__"


class TypePropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = type_property
        fields = [
            "TYPE",
            "PROPERTY_NAME",
            "CODE_LIST",
            "MANDATORY",
            "LABEL_ID",
            "PROP_GRP",
            "PROPERTY_TYPE",
            "SORT_ORDER",
            "ROW_ID",
            "LAYER_NAME",
            "PROP_UNIQUE",
            "HIDDEN",
            "UNICODE",
            "IS_KEY",
            "COLUMN_NAME",
            "DECIMALS",
            "UOM",
            "READ_ONLY",
            "PROPERTY_CLASS",
        ]


class TypePropertySaveUpdateSerializer(serializers.Serializer):
    def save(self, validated_data):
        request = validated_data
        validated_data = request.data
        qs = type_property.objects.filter(ROW_ID=validated_data.get("ROW_ID"))
        if qs:
            try:
                validate_value(validated_data, "TYPE_PROPERTY", request)
                qs.update(**validated_data)
            except Exception as e:
                raise ValidationError(e)
        else:
            try:
                validate_model_not_null(validated_data, "TYPE_PROPERTY", request)
                validated_data["VERSION"] = uuid.uuid4().hex
                validated_data["DB_ID"] = uuid.uuid4().hex
                typeProperty = type_property.objects.create(**validated_data)
                typeProperty.save()
                return typeProperty
            except Exception as e:
                raise ValidationError(e)


class TypePropertyCustomSaveSerializer(serializers.Serializer):
    def save(self, validated_data):
        request = validated_data
        validated_data = request.data.get("TYPE_PROPERTY")
        qs = type_property.objects.filter(ROW_ID=validated_data.get("ROW_ID"))
        if qs:
            try:
                validate_value(validated_data, "TYPE_PROPERTY", request)
                qs.update(**validated_data)
            except Exception as e:
                raise ValidationError(e)
        else:
            try:
                validate_model_not_null(validated_data, "TYPE_PROPERTY", request)
                validated_data["VERSION"] = uuid.uuid4().hex
                typeProperty = type_property.objects.create(**validated_data)
                typeProperty.save()
                return typeProperty
            except Exception as e:
                raise ValidationError(e)

    # def save(self, validated_data):
    #     validated_data["VERSION"] = uuid.uuid4().hex
    #     validated_data["ROW_ID"] = uuid.uuid4().hex
    #     type_properyes = type_property.objects.create(**validated_data)
    #     type_properyes.save()
    #     return type_properyes
