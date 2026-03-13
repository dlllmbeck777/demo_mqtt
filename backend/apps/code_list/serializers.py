from rest_framework import serializers
from .models import code_list
import uuid
from utils.models_utils import (
    validate_model_not_null,
    space_value_to_null,
    validate_value,
)
from rest_framework.exceptions import ValidationError

from services.logging.Handlers import KafkaLogger
from utils.utils import get_info_message
from utils.validations import CustomValidationError400, CustomValidationError404

logger = KafkaLogger()


class CodeListSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = code_list
        fields = "__all__"

    def save(self, validated_data):
        qs = code_list.objects.filter(ROW_ID=validated_data.get("ROW_ID"))
        # print(qs)
        if qs:
            try:
                # validate_value(item,"CODE_LIST",validated_data)
                qs.update(**validated_data)
            except Exception as e:
                msg = get_info_message("CODELIST.UPDATE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )
        else:
            try:
                validated_data["VERSION"] = uuid.uuid4().hex
                validated_data["ROW_ID"] = uuid.uuid4().hex
                codeList = code_list.objects.create(**validated_data)
                codeList.save()
                return True
            except Exception as e:
                msg = get_info_message("CODELIST.CREATE.FAIL")
                raise CustomValidationError400(
                    detail={"status_code": 400, "status_message": msg}
                )

    # def validate_CODE(self, value):
    #     # print(value)
    #     return value


class CodeListDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = code_list
        fields = ["ROW_ID", "CODE", "CODE_TEXT", "LIST_TYPE", "CULTURE", "LAYER_NAME"]


class CodeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = code_list
        fields = "__all__"


class CodeListDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = code_list
        fields = ["ROW_ID"]


class codeListNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = code_list
        fields = ["LIST_TYPE", "CULTURE", "CODE", "CODE_TEXT"]


class CodeListCustomNewSerializer(serializers.Serializer):
    def save(self, validated_data):
        try:
            data = validated_data.data.get("CODE_LIST")
            for item in data:
                space_value_to_null(item, validated_data)
                qs = code_list.objects.filter(ROW_ID=item.get("ROW_ID"))
                if qs:
                    try:
                        validate_value(item, "CODE_LIST", validated_data)
                        qs.update(**item)
                    except Exception as e:
                        raise ValidationError(e)
                else:
                    validate_model_not_null(item, "code_list", validated_data)
                    item["VERSION"] = uuid.uuid4().hex
                    codeList = code_list.objects.create(**item)
                    codeList.save()

            return str(codeList) + "Code list Created and updated successful"
        except:
            raise ValidationError(e)


class CodeListCustomSerializer(serializers.Serializer):
    def save(self, validated_data):
        if validated_data.data.get("HIERARCHY"):
            validated_data.data.pop("HIERARCHY")
        qs = code_list.objects.filter(ROW_ID=validated_data.data.get("ROW_ID"))
        if qs:
            try:
                validate_value(validated_data.data, "CODE_LIST", validated_data)
                qs.update(**validated_data.data)
                return "Code list update successful"
            except Exception as e:
                raise ValidationError(e)
        else:
            validate_model_not_null(validated_data.data, "code_list", validated_data)
            validated_data.data["VERSION"] = uuid.uuid4().hex

            codeList = code_list.objects.create(**validated_data.data)
            codeList.save()
            return str(codeList) + "Code list Created successful"
