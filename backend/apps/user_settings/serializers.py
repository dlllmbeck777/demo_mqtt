from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.user_settings.models import user_settings


class getAllSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = user_settings
        fields = "__all__"
