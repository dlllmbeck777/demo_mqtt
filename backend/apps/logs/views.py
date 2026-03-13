from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from services.notifications import consumer
from .models import logs
from .serializers import LogsSerializer
from .paginations import SimplePaginations


class GetAllLogsWithPaginationsView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LogsSerializer
    pagination_class = SimplePaginations

    def get(self, request, format=None):
        events = logs.objects.all().order_by("-time")
        serializer = LogsSerializer(events, many=True)

        paginated_result = self.paginate_queryset(
            serializer.data
        )  # Özel paginasyon metodu
        return self.get_paginated_response(paginated_result)
