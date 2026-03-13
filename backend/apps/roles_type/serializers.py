import uuid
from rest_framework import serializers
from .models import roles_type

class RolesTypeSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = roles_type
        fields = "__all__"
    
    def create(self, validated_data):
        data = validated_data
        data['ROW_ID'] = uuid.uuid4().hex
        instance = super().create(validated_data)
        return instance