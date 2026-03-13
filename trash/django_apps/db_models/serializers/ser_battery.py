from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from ..models import Battery


class BatterySerializer(serializers.ModelSerializer):
    last_updt_user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Battery
        fields = "__all__"
        # fields = ('id','name','parent', 'children')
