import uuid
from datetime import datetime
from rest_framework import serializers
from .models import resources_drawer


class ResourceDrawerDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 4
        model = resources_drawer
        fields = "__all__"

    def is_valid(self, *args, **kwargs):
        return True


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = resources_drawer
        fields = "__all__"
