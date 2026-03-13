from datetime import datetime
import uuid
from utils.models_utils import validate_model_not_null, validate_value
from rest_framework import serializers
from .models import uom
from rest_framework.exceptions import ValidationError


class UomDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = uom
        exclude = ("VERSION", "DB_ID", "LAST_UPDT_USER", "LAST_UPDT_DATE")


class UomQuantitySerializer(serializers.ModelSerializer):
    class Meta:
        model = uom
        fields = ["QUANTITY_TYPE", "NAME", "CATALOG_SYMBOL"]


class UomSaveUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = uom
        exclude = ("VERSION", "ROW_ID", "DB_ID")

    def save(self, validated_data):
        request = validated_data
        validated_data = request.data
        qs = uom.objects.filter(ROW_ID=validated_data.get("ROW_ID"))
        if qs:
            try:
                qs.update(**validated_data)
            except Exception as e:
                raise ValidationError(e)
        else:
            try:
                validated_data["VERSION"] = uuid.uuid4().hex
                validated_data["DB_ID"] = uuid.uuid4().hex
                validated_data["RESULT"] = "(A + (B*X)) / (C + (D*X))"
                validated_data["LAST_UPDT_DATE"] = datetime.now().strftime("%Y-%m-%d")
                typeProperty = uom.objects.create(**validated_data)
                typeProperty.save()
                return typeProperty
            except Exception as e:
                raise ValidationError(e)

    def update(self, validated_data):
        request = validated_data
        validated_data = request.data[0]
        qs = uom.objects.filter(ROW_ID=validated_data.get("ROW_ID"))
        if qs:
            validated_data.pop("IS_BASE_UOM")
            qs.update(**validated_data)

    def create(self, validated_data):
        request = validated_data
        validated_data = request.data[0]
        validated_data["VERSION"] = uuid.uuid4().hex
        validated_data["DB_ID"] = uuid.uuid4().hex
        validated_data["RESULT"] = "(A + (B*X)) / (C + (D*X))"
        validated_data["LAST_UPDT_DATE"] = datetime.now().strftime("%Y-%m-%d")
        typeProperty = uom.objects.create(**validated_data)
        typeProperty.save()
