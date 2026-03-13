import uuid
from datetime import datetime
from rest_framework import serializers
from .models import resources_drawer

class ResourceDrawerSaveSerializer(serializers.Serializer):
    def create(self, validated_data):
        validated_data["VERSION"] = uuid.uuid4().hex
        validated_data["ROW_ID"] = uuid.uuid4().hex
        ResourceDrawer = resources_drawer.objects.create(**validated_data)
        ResourceDrawer.save()
        return ResourceDrawer


class ResourceDrawerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = resources_drawer
        fields = "__all__"