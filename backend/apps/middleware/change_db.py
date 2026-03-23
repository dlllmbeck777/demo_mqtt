from rest_framework.authentication import TokenAuthentication
from apps.users.models import User
from apps.layer.helpers import change_db, get_std_db_alias, to_layerDb


class ChangeDBMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            to_layerDb("STD")
            layers = self.getActiveLayer(request.user)
            self.changeDbConnections(layers)
            request.active_layers = layers
            return self.get_response(request)
        finally:
            change_db("default")

    def getActiveLayer(self, user):
        if not getattr(user, "is_authenticated", False):
            return "STD"
        alias = get_std_db_alias()
        layers = (
            User.objects.using(alias)
            .filter(email=str(user))
            .values("active_layer")
            .first()
        )
        if layers:
            return layers.get("active_layer")
        else:
            return "STD"

    def changeDbConnections(self, layers):
        try:
            to_layerDb(layers)
        except Exception as e:
            change_db("default")
