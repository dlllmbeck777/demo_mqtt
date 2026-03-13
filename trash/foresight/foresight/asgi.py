import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.http import AsgiHandler
import foresight.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "foresight.settings")

application = ProtocolTypeRouter({
  "http": AsgiHandler(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            foresight.routing.websocket_urlpatterns
        )
    ),
})