from rest_framework import serializers
from .models import item_link
from utils.models_utils import validate_model_not_null
import uuid


class ItemLinkSaveSerializer(serializers.Serializer):
    def save(self, validated_data):
        item = item_link.objects.filter(LINK_ID=validated_data.get("LINK_ID"))

        if item:
            item.update(**validated_data)
        else:
            validated_data["VERSION"] = uuid.uuid4().hex
            validated_data["UPDATE_SOURCE"] = "x"
            validated_data["CREATE_SOURCE"] = "x"
            items = item_link.objects.create(**validated_data)
            items.save()
        return "Succsessful"


class ItemLinkDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = item_link
        fields = [
            "LINK_ID",
            "LINK_TYPE",
            "FROM_ITEM_ID",
            "FROM_ITEM_TYPE",
            "TO_ITEM_ID",
            "TO_ITEM_TYPE",
            "START_DATETIME",
            "END_DATETIME",
        ]


class ItemLinkDetailsTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = item_link
        fields = [
            "FROM_ITEM_ID",
        ]
