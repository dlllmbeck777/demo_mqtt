from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from ..models import Field


class FieldSerializer(serializers.ModelSerializer):
    last_updt_user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Field
        fields = "__all__"
