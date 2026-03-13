import uuid
from apps.layer.helpers import updateDB, to_layerDb
from rest_framework import serializers
from .models import item_event
from apps.users.models import User


class ItemEventStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = item_event
        fields = "__all__"

    def save(self, validated_data):
        row_id = validated_data["ROW_ID"]
        obj = item_event.objects.filter(ROW_ID=row_id)
        if obj:
            obj.update(**validated_data)
        else:
            item_event.objects.create()


class ItemEventFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = item_event
        fields = "__all__"

    def is_valid(self, *args, **kwargs):
        return True

    def save(self, validated_data):
        row_id = validated_data["ROW_ID"]
        obj = item_event.objects.filter(ROW_ID=row_id)
        if obj:
            obj.update(**validated_data)
        else:
            item_event.objects.create(**validated_data)


# class ItemEventSaveSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = item_event
#         fields = "__all__"

#     def save(self, validated_data):
#         item_id = validated_data["ITEM_ID"]
#         obj = item_event.objects.filter(ROW_ID=row_id)
#         if obj:
#             obj.update(**validated_data)
#         else:
#             item_event.objects.create()
