from rest_framework import serializers


class ImportFileSerializer(serializers.Serializer):
    FILE = serializers.FileField()
