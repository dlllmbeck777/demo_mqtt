from rest_framework import serializers
from .models import tags_calculated


class TagCalculatedSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = tags_calculated
        fields = "__all__"


class TagsCalculatedImportFileSerializer(serializers.Serializer):
    files = serializers.FileField()


class TagCalculatedGetNameSerializers(serializers.ModelSerializer):
    class Meta:
        model = tags_calculated
        fields = ("NAME", "TAG_ID")


class TagCalculatedGetAllDetailsSerializers(serializers.ModelSerializer):
    class Meta:
        model = tags_calculated
        fields = "__all__"


class TagsCalculatedSaveAndUpdateSerializer(serializers.Serializer):
    def save(self, validated_data):  #
        qs = tags_calculated.objects.filter(TAG_ID=validated_data.get("TAG_ID"))
        if qs:
            qs.update(**validated_data)
            return "Update"
        else:
            tagss = tags_calculated.objects.create(**validated_data)
            tagss.save()

            return "Save"
