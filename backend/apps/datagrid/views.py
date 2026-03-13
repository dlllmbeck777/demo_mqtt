from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from .serializers import ImportFileSerializer
from .factory_model.manager import get_model


class LoaderSaveModelData(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ImportFileSerializer

    def get_queryset(self):
        pass

    def post(self, request, *args, **kwargs):
        create_data = request.data["CREATE"]
        update_data = request.data["UPDATE"]
        delete_data = request.data["DELETE"]
        model = str(request.data["PROP_TBL_NAME"])

        importer = get_model(model)
        importer.get_request(request)
        importer.create_obj(create_data)
        importer.update_obj(update_data)
        importer.delete_obj(delete_data)
        # importer.save_to_database(data)
        return Response(
            "data",
            status=status.HTTP_200_OK,
        )
