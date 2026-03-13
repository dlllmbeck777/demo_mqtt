from django.shortcuts import render
from utils.utils import get_info_message
from utils.validations import CustomValidationError400
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import bi_layout
from .serializers import LayoutsSerializer
import uuid
from rest_framework.response import Response


# Create your views here.
class LayoutsSaveView(generics.CreateAPIView):
    serializer_class = LayoutsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LayoutsSerializer(data=request.data)
        if serializer.is_valid():
            layout = serializer.save()
            message = LayoutsSerializer(layout).data
            return Response(message, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Create your views here.
class LayoutsUpdateView(generics.CreateAPIView):
    serializer_class = LayoutsSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            for keys, values in request.data.items():
                for value in values:
                    qs = bi_layout.objects.filter(i=value.get("i"), l_type=keys)
                    if qs:
                        qs.update(**value)
            msg = get_info_message("LAYOUTS.UPDATE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            # Red.delete(str(request.user) + request.data.get("HIERARCHY")[0])
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            msg = get_info_message("LAYOUTS.UPDATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )
