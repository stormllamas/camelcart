import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "trike.settings")
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

from django.conf.urls import url
from django.core.asgi import get_asgi_application

# Models
from logistics.consumers import OrderConsumer


application = ProtocolTypeRouter({
    # Django's ASGI application to handle traditional HTTP requests
    "http": get_asgi_application(),

    # WebSocket chat handler
    # "websocket": AllowedHostOriginValidator(
    #   AuthMiddlewareStack(
    #     URLRouter([
    #       url(r"^chat/admin/$", AdminChatConsumer.as_asgi()),
    #       url(r"^chat/$", PublicChatConsumer.as_asgi()),
    #     ])
    #   ),
    # ),
    "websocket": AuthMiddlewareStack(
      URLRouter([
        url(r"^order_update/$", OrderConsumer.as_asgi()),
      ])
    ),
})