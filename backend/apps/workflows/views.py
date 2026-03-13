from django.shortcuts import render
from utils.utils import get_info_message
from utils.validations import CustomValidationError400
from utils.models_utils import validate_find
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import workflows
from .serializers import WorkflowsSerializers, WorkflowsGetByIdSerializers
import json


class WorkFlowsCreateView(generics.CreateAPIView):
    serializer_class = WorkflowsSerializers
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = self.get_serializer(data=data)

            msg = get_info_message("WORKFLOW.CREATE.SUCCESS")
            response_data = {"status_code": 200, "status_message": msg}
            if serializer.is_valid():
                serializer.create(data)
            response_data["data"] = data
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            msg = get_info_message("WORKFLOW.CREATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class WorkFlowsUpdateView(generics.CreateAPIView):
    serializer_class = WorkflowsSerializers
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                serializer.update(data)

            msg = get_info_message("WORKFLOW.CREATE.SUCCESS")
            response_data = {"status_code": 200, "status_message": msg, "data": data}
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            msg = get_info_message("WORKFLOW.CREATE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class WorkFlowsDeleteView(generics.CreateAPIView):
    serializer_class = WorkflowsSerializers
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            row_id = request.data.get("ROW_ID")
            workflows.objects.filter(ROW_ID=row_id).delete()
            msg = get_info_message("WORKFLOW.DELETE.SUCCESS")
            data = {"status_code": 200, "status_message": msg}
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            msg = get_info_message("WORKFLOW.DELETE.FAIL")
            raise CustomValidationError400(
                detail={"status_code": 400, "status_message": msg}
            )


class WorkFlowsGetView(generics.ListAPIView):
    serializer_class = WorkflowsSerializers
    permission_classes = [permissions.AllowAny]
    queryset = workflows.objects.all().order_by("NAME").values("NAME", "ROW_ID")

    def get(self, request, *args, **kwargs):
        qs = self.get_queryset()
        return Response(qs)


class WorkFlowsGetByIdView(generics.CreateAPIView):
    serializer_class = WorkflowsGetByIdSerializers
    permission_classes = [permissions.AllowAny]
    queryset = workflows.objects.none()

    def get(self, request, *args, **kwargs):
        row_id = self.kwargs["row_id"]
        queryset = workflows.objects.filter(ROW_ID=row_id)
        serializer = WorkflowsGetByIdSerializers(queryset, many=True)
        return Response(serializer.data)
