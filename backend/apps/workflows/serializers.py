from datetime import datetime
import uuid
from utils.models_utils import validate_model_not_null, validate_value
from rest_framework import serializers
from .models import workflows
from rest_framework.exceptions import ValidationError


class WorkflowsSerializers(serializers.ModelSerializer):
    class Meta:
        model = workflows
        fields = "__all__"

    def is_valid(self, raise_exception=False):
        return True

    def create(self, validated_data):
        validated_data["ROW_ID"] = uuid.uuid4().hex
        validated_data["VERSION"] = uuid.uuid4().hex
        workflow = workflows.objects.create(**validated_data)
        workflow.save()
        return workflow

    def update(self, validated_data):
        workflow = workflows.objects.filter(ROW_ID=validated_data["ROW_ID"])
        now = datetime.now()
        validated_data["LAST_UPDT_DATE"] = now.strftime("%Y-%m-%d")
        if workflow:
            workflow.update(**validated_data)
        return workflow


class WorkflowsGetByIdSerializers(serializers.ModelSerializer):
    class Meta:
        model = workflows
        exclude = ["LAST_UPDT_DATE"]
