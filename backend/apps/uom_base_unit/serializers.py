import uuid
from utils.models_utils import validate_model_not_null, validate_value
from rest_framework import serializers
from .models import uom_base_unit
from rest_framework.exceptions import ValidationError


class UomUnitDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = uom_base_unit
        fields = "__all__"


class UomUnitQuantitySerializer(serializers.ModelSerializer):
    class Meta:
        model = uom_base_unit
        fields = ["QUANTITY_TYPE"]


class BaseUOMSaveUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = uom_base_unit
        exclude = ("VERSION", "ROW_ID", "DB_ID")

    def save(self, validated_data):
        request = validated_data
        validated_data = request.data
        qs = uom_base_unit.objects.filter(ROW_ID=validated_data.get("ROW_ID"))
        if qs:
            try:
                validate_value(validated_data, "UOM_BASE_UNIT", request)
                qs.update(**validated_data)
            except Exception as e:
                raise ValidationError(e)
        else:
            try:
                validate_model_not_null(validated_data, "UOM_BASE_UNIT", request)
                validated_data["VERSION"] = uuid.uuid4().hex
                validated_data["DB_ID"] = uuid.uuid4().hex
                typeProperty = uom_base_unit.objects.create(**validated_data)
                typeProperty.save()
                return typeProperty
            except Exception as e:
                raise ValidationError(e)
