import uuid
from datetime import datetime
from rest_framework import serializers

from .models import resources_types


class ResourceTypesSaveSerializer(serializers.Serializer):
    def create(self, validated_data):
        su_anin_tarihi = datetime.now()
        formatli_tarih = su_anin_tarihi.strftime("%Y-%m-%d")
        validated_data["VERSION"] = uuid.uuid4().hex
        validated_data["ROW_ID"] = uuid.uuid4().hex
        validated_data["LAST_UPDT_DATE"] = formatli_tarih
        resources_types.objects.create(**validated_data)


class ResourceTypesUpdateSerializer(serializers.Serializer):
    def update(self, validated_data):
        query = resources_types.objects.filter(ROW_ID=validated_data["ROW_ID"])
        if query:
            su_anin_tarihi = datetime.now()
            formatli_tarih = su_anin_tarihi.strftime("%Y-%m-%d")
            validated_data["LAST_UPDT_DATE"] = formatli_tarih
            query.update(**validated_data)
        return query


class ResourceTypesTypeSerializer(serializers.Serializer):
    def save(self, validated_data):
        resource_dict = dict()
        types = validated_data.data.get("TYPE")
        resource_dict["ID"] = "TYPE." + str(types.get("TYPE"))
        label = list(str(types.get("TYPE")).lower())
        label[0] = str(label[0]).upper()
        resource_dict["SHORT_LABEL"] = str().join(label)
        resource_dict["LAYER_NAME"] = types.get("LAYER_NAME")
        resource_dict["LAST_UPDT_DATE"] = str(datetime.now()).split(" ")[0]
        resource_dict["LAST_UPDT_USER"] = str(validated_data.user)
        resource_dict["VERSION"] = uuid.uuid4().hex
        resource_dict["ROW_ID"] = uuid.uuid4().hex
        resource_dict["CULTURE"] = validated_data.data.get("CULTURE")
        qs = resources_types.objects.filter(
            ID=resource_dict["ID"],
            SHORT_LABEL=resource_dict.get("SHORT_LABEL"),
            CULTURE=resource_dict["CULTURE"],
        )
        if qs:
            qs.update(**resource_dict)
        else:
            rs_list = resources_types.objects.create(**resource_dict)
            rs_list.save()
        return resources_types


class ResourceTypesDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = resources_types
        fields = "__all__"


class ResourceTypesParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = resources_types
        fields = ["PARENT"]


class ResourceTypesSerializer(serializers.ModelSerializer):
    class Meta:
        model = resources_types
        fields = ["CULTURE", "SHORT_LABEL", "MOBILE_LABEL"]


class ResourceTypesLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = resources_types
        fields = ["SHORT_LABEL", "MOBILE_LABEL", "ID"]
