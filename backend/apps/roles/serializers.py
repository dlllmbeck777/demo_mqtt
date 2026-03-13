import uuid
from rest_framework import serializers
from .models import roles


class RolesSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = roles
        exclude = ("PROPERTY_ID",)


class RolesPropertySerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = roles
        fields = ["PROPERTY_ID"]


class RolesPropertyNameSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = roles
        fields = ["PROPERTY_ID", "ROLES_NAME"]


class RolesSaveAndUpdatePropertySaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = roles
        fields = "__all__"

    def is_valid(self, raise_exception=False):
        valid = super().is_valid(raise_exception=raise_exception)
        return True

    def save(self, validated_data):
        try:
            roles_id = validated_data.get("ROLES_ID")
            qs = roles.objects.filter(ROLES_ID=roles_id)
            if qs.exists():
                instance = super().update(qs.first(), validated_data)
            else:
                instance = super().create(validated_data)
                instance.save()
            return instance
        except Exception as e:
            print(e)
            raise ValidationError(str(e))
