from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from .serializers import ImportFileSerializer
from .factory.manager import get_data
from .factory_model.manager import get_model


class LoaderReturnFileData(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ImportFileSerializer

    def get_queryset(self):
        pass

    def post(self, request, *args, **kwargs):
        file_name = request.FILES["FILE"]
        extension = request.data["EXTENSION"]
        seperator = request.data["SEPERATOR"]
        importer = get_data(extension=extension)
        data = importer.load_data(file_name, seperator)
        return Response(
            data,
            status=status.HTTP_200_OK,
        )


class LoaderSaveModelData(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ImportFileSerializer

    def get_queryset(self):
        pass

    def post(self, request, *args, **kwargs):
        data = request.data["data"]
        model = str(request.data["PROP_TBL_NAME"])
        importer = get_model(model)
        importer.save_to_database(data)
        return Response(
            "data",
            status=status.HTTP_200_OK,
        )
