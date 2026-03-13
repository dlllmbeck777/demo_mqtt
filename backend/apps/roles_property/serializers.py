import uuid
from rest_framework import serializers
from .models import roles_property
from rest_framework.exceptions import ValidationError

# class RolesPropertySaveSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = roles_property
#         fields = "__all__"


class RolesPropertySaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = roles_property
        fields = "__all__"

    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)
        return True

    def save(self, validated_data):
        try:
            row_id = validated_data.get("ROW_ID")
            qs = roles_property.objects.filter(ROW_ID=row_id)
            if qs.exists():
                instance = super().update(qs.first(), validated_data)
                print(qs)
            else:
                instance = super().create(validated_data)
                instance.save()
            return instance
        except Exception as e:
            print(e)
            raise ValidationError(str(e))
