from rest_framework.authentication import TokenAuthentication
from apps.users.models import User
from apps.layer.helpers import change_db, to_layerDb
from django.db import connection, connections
from django.db import DEFAULT_DB_ALIAS


class ChangeDBMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        to_layerDb("STD")
        layers = self.getActiveLayer(request.user)
        self.changeDbConnections(layers)
        self.request = request
        request.active_layers = layers
        # print(request.path)
        response = self.get_response(request)
        connections[DEFAULT_DB_ALIAS] = connections["default"]
        return response

    def getActiveLayer(self, user):
        to_layerDb("STD")
        layers = User.objects.filter(email=user).values("active_layer").first()
        if layers:
            return layers.get("active_layer")
        else:
            return "STD"

    def changeDbConnections(self, layers):
        try:
            to_layerDb(layers)
        except Exception as e:
            change_db("default")
