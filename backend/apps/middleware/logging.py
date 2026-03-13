from services.logging.Handlers import KafkaLogger
from utils.utils import get_http_message
from rest_framework.response import Response

logger = KafkaLogger()


class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if str(request.user) != "AnonymousUser":
            message = get_http_message(response.status_code)
            if response.status_code < 300:
                logger.info(message=message, request=request)
            elif 400 <= response.status_code < 500:
                logger.warning(message=message, request=request)
            elif response.status_code >= 500:
                logger.error(message=message, request=request)
            # print(message, " --------->", request.path)
        return response
