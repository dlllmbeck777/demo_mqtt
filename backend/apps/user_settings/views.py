from django.shortcuts import render
from utils.utils import get_info_message
from utils.validations import CustomValidationError400
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from apps.user_settings.serializers import getAllSettingsSerializer
from apps.user_settings.models import user_settings
from services.logging.Handlers import KafkaLogger

logger = KafkaLogger()


def ensure_user_settings(user):
    if not getattr(user, "is_authenticated", False):
        return None

    user_email = getattr(user, "email", None) or str(user)
    settings_obj, _ = user_settings.objects.get_or_create(USER=user_email)
    return settings_obj


# Create your views here.
class gelAllSettingsByUser(generics.ListAPIView):
    serializer_class = getAllSettingsSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        try:
            settings_obj = ensure_user_settings(request.user)
            queryset = (
                user_settings.objects.filter(pk=settings_obj.pk)
                if settings_obj
                else user_settings.objects.none()
            )
            serializer = getAllSettingsSerializer(queryset, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class updateSettingsByUser(generics.CreateAPIView):
    serializer_class = getAllSettingsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            settings_obj = ensure_user_settings(request.user)
            if settings_obj:
                user_settings.objects.filter(pk=settings_obj.pk).update(**request.data)
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
            settings_obj = ensure_user_settings(request.user)
            queryset = (
                user_settings.objects.filter(pk=settings_obj.pk).values(key).first()
                if settings_obj
                else None
            )
            return Response(queryset or {key: None}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message": "An error occurred:"}, status=400)
