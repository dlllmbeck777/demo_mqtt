import uuid
from apps.layer.helpers import updateDB, to_layerDb
from rest_framework import serializers
from .models import layer
from apps.users.models import User
from .tasks import async_update_database


class LayerDropDownSerializer(serializers.ModelSerializer):
    class Meta:
        model = layer
        fields = [
            "LAYER_NAME",
        ]


class LayerSaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = layer
        fields = "__all__"

    def create(self, validated_data):
        layers = layer.objects.create(**validated_data)
        layers.save()
        return layers

    def test(self, validated_data, layers, set_layer):
        if validated_data["LAYER_NAME"] != layers["LAYER_NAME"]:
            users = User.objects.all()
            new_layer = layer.objects.filter(LAYER_NAME=layers["LAYER_NAME"])
            for user in users:
                user.layer_name.set(set_layer)
                user.active_layer = layer.objects.get(LAYER_NAME="STD")
                user.save()
            new_layer.update(**validated_data)

    def update(self, validated_data):
        layers = (
            layer.objects.filter(ROW_ID=validated_data.get("ROW_ID"))
            .values("LAYER_NAME", "DB_SETTINGS")
            .first()
        )
        if layers:
            try:
                to_layerDb("STD")
                to_layerDb(layers["LAYER_NAME"])
                self.test(validated_data, layers, [])
                new_layer = layer.objects.filter(
                    LAYER_NAME=validated_data["LAYER_NAME"]
                ).first()
                users = User.objects.all()
                for user in users:
                    user.layer_name.set(["STD", new_layer.LAYER_NAME])
                    user.active_layer = layer.objects.get(
                        LAYER_NAME=validated_data["LAYER_NAME"]
                    )
                    user.save()
            except Exception as e:
                print(str(e))
            """ LAYER DATABASE UPDATE
            ------------------------------------------------------------------
                STD DATABASE UPDATE """
            try:
                to_layerDb("STD")
                users = User.objects.filter(layer_name=layers["LAYER_NAME"])
                new_layer = layer.objects.filter(LAYER_NAME=layers["LAYER_NAME"])
                for user in users:
                    user.layer_name.remove(layers["LAYER_NAME"])
                    user.active_layer = layer.objects.get(LAYER_NAME="STD")
                    user.save()
                new_layer.update(**validated_data)
                new_layer = layer.objects.filter(
                    LAYER_NAME=validated_data["LAYER_NAME"]
                ).first()
                users = User.objects.filter(layer_name=layers["LAYER_NAME"])
                for user in users:
                    user.layer_name.add(new_layer.LAYER_NAME)
                    user.active_layer = layer.objects.get(
                        LAYER_NAME=validated_data["LAYER_NAME"]
                    )
                    user.save()
            except Exception as e:
                print(str(e))
            async_update_database(
                layers["DB_SETTINGS"]["NAME"],
                validated_data["DB_SETTINGS"]["NAME"],
            )
        return layers
