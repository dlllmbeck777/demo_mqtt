import uuid
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import bi_widget
from datetime import datetime


class WidgetSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = bi_widget
        fields = "__all__"

    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)
        return True

    def save(self, validated_data):
        try:
            validated_data["START_DATETIME"] = "2023-03-25"
            validated_data["END_DATETIME"] = "9000-01-01"
            widget_id = validated_data.get("WIDGET_ID")
            qs = bi_widget.objects.filter(WIDGET_ID=widget_id)
            if qs.exists():
                instance = super().update(qs.first(), validated_data)
            else:
                instance = super().create(validated_data)
            return instance
        except Exception as e:
            raise ValidationError(str(e))
