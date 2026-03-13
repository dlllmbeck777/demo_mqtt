from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import RolesPropertySaveSerializer
from .models import roles_property
from utils.utils import import_data


class RolesPropSaveView(generics.GenericAPIView):
    serializer_class = RolesPropertySaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            roles_property = serializer.save()
            return Response(
                {
                    "Message": "Succsessful",
                }
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RolesPropScriptView(generics.GenericAPIView):
    serializer_class = RolesPropertySaveSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        # message = import_data(roles_property,"roles_property")
        # model.objects.bulk_create([model(**item) for item in chunk])
        return Response({"Message": "message"}, status=status.HTTP_200_OK)


class RolesPropGetView(generics.GenericAPIView):
    serializer_class = RolesPropertySaveSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            roles_id = request.data.get("ROLES_ID")
            queryset = roles_property.objects.filter(ROLES_ID=roles_id)
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
