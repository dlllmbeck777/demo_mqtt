from django.shortcuts import render
from utils.utils import get_info_message
from utils.validations import CustomValidationError400
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from apps.user_settings.serializers import getAllSettingsSerializer
from apps.user_settings.models import user_settings
from services.logging.Handlers import KafkaLogger

logger = KafkaLogger()


# Create your views here.
class gelAllSettingsByUser(generics.ListAPIView):
    serializer_class = getAllSettingsSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            queryset = user_settings.objects.filter(USER=request.user)
            serializer = getAllSettingsSerializer(queryset, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class updateSettingsByUser(generics.CreateAPIView):
    serializer_class = getAllSettingsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            queryset = user_settings.objects.filter(USER=request.user)
            queryset.update(**request.data)
            msg = get_info_message("PROFILE.UPDATE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            msg = get_info_message("PROFILE.UPDATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class getStateSettingsByUser(generics.CreateAPIView):
    serializer_class = getAllSettingsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            key = request.data["key"]
            queryset = user_settings.objects.filter(USER=request.user).values(key)
            return Response(queryset[0], status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message": "An error occurred:"}, status=400)
