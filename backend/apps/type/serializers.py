import uuid

from rest_framework import serializers
from utils.models_utils import validate_model_not_null, validate_value
from rest_framework.exceptions import ValidationError
from .models import type as Type
from services.logging.Handlers import KafkaLogger

logger = KafkaLogger()


class TypeSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = "__all__"

    def create(self, validated_data):
        # print(validated_data)
        validated_data["VERSION"] = uuid.uuid4().hex
        validated_data["ROW_ID"] = uuid.uuid4().hex
        types = Type.objects.create(**validated_data)
        types.save()
        return types


class TypeDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = "__all__"


class TypeDetailsTreeMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ("TYPE", "LABEL_ID")


class TypeEditorSaveSerializer(serializers.Serializer):
    def save(self, validated_data):
        qs = Type.objects.filter(TYPE=validated_data.data.get("TYPE"))
        if qs:
            try:
                validate_value(validated_data.data, "TYPE", validated_data)
                qs.update(**validated_data.data)
            except Exception as e:
                raise ValidationError(e)
        else:
            try:
                validate_model_not_null(
                    validated_data.data, "TYPE", request=validated_data
                )
                validated_data.data["VERSION"] = uuid.uuid4().hex
                validated_data.data["DB_ID"] = uuid.uuid4().hex
                types = Type.objects.create(**validated_data.data)
                types.save()
                return types
            except Exception as e:
                print(str(e))
                raise ValidationError(e)


class TypeResourceListManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ["TYPE", "LABEL_ID"]


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = [
            "TYPE",
            "BASE_TYPE",
        ]


class TypeCustomSaveSerializer(serializers.Serializer):
    def save(self, validated_data):
        request = validated_data
        validated_data = request.data.get("TYPE")
        qs = Type.objects.filter(TYPE=validated_data.get("TYPE"))
        if qs:
            try:
                if validated_data.get("ROW_ID"):
                    validated_data.pop("ROW_ID")
                validate_value(validated_data, "TYPE", request=request)
                qs.update(**validated_data)
            except Exception as e:
                raise ValidationError(e)
        else:
            try:
                validate_model_not_null(validated_data, "TYPE", request)
                validated_data["VERSION"] = uuid.uuid4().hex
                types = Type.objects.create(**validated_data)
                types.save()
                return types
            except Exception as e:
                raise ValidationError(e)

    # def save(self, validated_data):

    #     validated_data['VERSION'] = uuid.uuid4().hex
    #     validated_data['ROW_ID'] = uuid.uuid4().hex
    #     types = Type.objects.create(**validated_data)
    #     types.save()
    #     return types
