from rest_framework import serializers
import uuid
from .models import feedback


class FeedbackSerializers(serializers.ModelSerializer):
    class Meta:
        model = feedback
        fields = "__all__"
