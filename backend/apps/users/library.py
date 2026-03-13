import email
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.contrib.auth import login
from django.contrib.auth.models import update_last_login
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect
from apps.layer.helpers import to_layerDb
from utils.utils import get_http_message

#### REST-AUTH
from django.urls import include, path, reverse
from rest_framework import generics, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from utils.utils import get_info_message

# from knox.auth import AuthToken, TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from services.logging.Handlers import KafkaLogger
from utils.utils import AtomicMixin
from utils.models_utils import validate_find
from apps.roles.models import roles
from .models import *
from .models import User
from .serializers import (
    ChangePasswordSerializer,
    ForgetPasswordSerializer,
    ResetNewPasswordSerializer,
    UserLoginSerializer,
    UserModelSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    UserChangeDbSerializer,
    UserModelDepth2Serializer,
    UserModelDepthSerializer,
)

logger = KafkaLogger()
