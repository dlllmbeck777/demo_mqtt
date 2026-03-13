from .serializers import SocialLoginSerializer
from .library import *
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
import urllib.parse

logger = KafkaLogger()


class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
    serializer_class = SocialLoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            # Önce üst sınıfın post metodunu çalıştırarak gerekli işlemleri yapın
            response = super().post(request, *args, **kwargs)

            # Gerekli ek işlemleri burada gerçekleştirin

            return response
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    serializer_class = SocialLoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            # Önce üst sınıfın post metodunu çalıştırarak gerekli işlemleri yapın
            response = super().post(request, *args, **kwargs)

            # Gerekli ek işlemleri burada gerçekleştirin

            return response
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class GoogleRegister(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    serializer_class = SocialLoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            # Önce üst sınıfın post metodunu çalıştırarak gerekli işlemleri yapın
            response = super().post(request, *args, **kwargs)

            # Gerekli ek işlemleri burada gerçekleştirin
            return response
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class FacebookRegister(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

    def post(self, request, *args, **kwargs):
        try:
            # Önce üst sınıfın post metodunu çalıştırarak gerekli işlemleri yapın
            response = super().post(request, *args, **kwargs)

            # Gerekli ek işlemleri burada gerçekleştirin
            return response
        except Exception as e:
            return Response({"message": "An error occurred:"}, status=400)


class GitHubLogin(SocialLoginView):
    serializer_class = SocialLoginSerializer
    adapter_class = GitHubOAuth2Adapter
