import uuid
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import bi_widget_property
from datetime import datetime
from apps.tags_calculated.models import tags_calculated
from .helpers import find_cal_or_tag


class Widget_PropertyDublicateSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = bi_widget_property
        fields = "__all__"


class Widget_PropertyGetSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = bi_widget_property
        fields = (
            "WIDGET_ID",
            "PROPERTY_NAME",
            "PROPERTY_STRING",
            "PROPERTY_TAG",
            "PROPERTY_JSON",
            "PROPERTY_BOOLEAN",
            "PROPERTY_TAG_CAL",
        )


class Widget_PropertySaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = bi_widget_property
        fields = "__all__"

    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)
        return True

    def save(self, validated_data):
        try:
            validated_data["START_DATETIME"] = "2023-03-25"
            validated_data["END_DATETIME"] = "9000-01-01"
            row_id = validated_data.get("ROW_ID")
            qs = bi_widget_property.objects.filter(ROW_ID=row_id)
            tag_cal = []
            value = "PROPERTY_TAG"
            liste = list(validated_data.keys())
            kwargs = {
                "value": value,
                "liste": liste,
                "validated_data": validated_data,
                "tag_cal": tag_cal,
                "tags_calculated": tags_calculated,
            }
            find_cal_or_tag(**kwargs)
            if qs.exists():
                instance = super().update(qs.first(), validated_data)
            else:
                instance = super().create(validated_data)
                instance.save()
            return instance
        except Exception as e:
            # print(validated_data.get("PROPERTY_STRING"))
            raise ValidationError(str(e))


class Widget_PropertyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = bi_widget_property
        fields = "__all__"

    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)
        return True

    def save(self, validated_data):
        try:
            widgetId = validated_data.get("WIDGET_ID")[0]
            propertyName = validated_data.get("PROPERTY_NAME")

            qs = bi_widget_property.objects.filter(
                WIDGET_ID=widgetId, PROPERTY_NAME=propertyName
            )
            tag_cal = []
            value = "PROPERTY_TAG"
            liste = list(validated_data.keys())
            kwargs = {
                "value": value,
                "liste": liste,
                "validated_data": validated_data,
                "tag_cal": tag_cal,
                "tags_calculated": tags_calculated,
            }
            find_cal_or_tag(**kwargs)
            if qs.exists():
                validated_data["PROPERTY_TAG_CAL"] = tag_cal
                instance = super().update(qs.first(), validated_data)
            else:
                validated_data["START_DATETIME"] = "2023-03-25"
                validated_data["END_DATETIME"] = "9000-01-01"
                validated_data["ROW_ID"] = uuid.uuid4().hex
                instance = super().create(validated_data)
                instance.save()
            return instance
        except Exception as e:
            # print(validated_data.get("PROPERTY_STRING"))
            raise ValidationError(str(e))
