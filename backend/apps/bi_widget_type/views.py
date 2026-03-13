from django.shortcuts import render
from .serializers import Widget_TypeSaveSerializer
from rest_framework import permissions, generics, status
from rest_framework.response import Response
from .models import bi_widget_type
from utils.utils import import_data
from apps.layer.helpers import to_layerDb


# Create your views here.
class WidgetTypeSaveView(generics.CreateAPIView):
    serializer_class = Widget_TypeSaveSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(
        self,
    ):
        pass

    def post(self, request, *args, **kwargs):
        data = {
            "WIDGET_TYPE": request.data["WIDGET_TYPE"],
            "properties": request.data["properties"],
        }
        bi_widget_type.objects.create(**data)
        return Response({"Message": "Successful"}, status=status.HTTP_201_CREATED)


class WidgetTypeGetView(generics.CreateAPIView):
    serializer_class = Widget_TypeSaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        qs = bi_widget_type.objects.filter(**request.data).values()
        return Response(qs, status=status.HTTP_200_OK)


class WidgetTypeScriptView(generics.ListAPIView):
    serializer_class = Widget_TypeSaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        import_data(bi_widget_type, "bi_widget_type")
        return Response({"Message": "Successful"}, status=status.HTTP_201_CREATED)
