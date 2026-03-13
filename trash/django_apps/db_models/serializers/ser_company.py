from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from ..models import Company


class CompanySerializer(serializers.ModelSerializer):
    last_updt_user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Company
        fields = "__all__"
