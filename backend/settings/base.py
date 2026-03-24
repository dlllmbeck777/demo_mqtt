import os
import logging
import importlib.util
import environ
from datetime import timedelta
from rest_framework.settings import api_settings
from django.utils.translation import gettext_lazy as _
from settings.localapp import modelApp
from utils.service_config import MONGO_URL

logger = logging.getLogger(__name__)

env = environ.Env(DEBUG=(bool, False))

BASE_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "backend/"
)

environ.Env.read_env(os.path.join(BASE_DIR, "../.env"))
os.environ.setdefault("Mongo_Client", MONGO_URL)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

BROKER_URL = os.environ.get(
    "CELERY_BROKER",
    os.environ.get("BROKER_URL", "redis://redis:6379/1"),
)
CELERY_RESULT_BACKEND = os.environ.get(
    "CELERY_BACKEND",
    os.environ.get("CELERY_RESULT_BACKEND", BROKER_URL),
)
CELERY_ACCEPT_CONTENT = ["application/json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"


DEBUG = env("DEBUG")
TEMPLATE_DEBUG = DEBUG
PAGE_CACHE_SECONDS = 60
LOGGING_CONFIG = None
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
SITE_ID = 1
# TODO: n a real production server this should have a proper url
ALLOWED_HOSTS = env("ALLOWED_HOSTS").split(" ")
CORS_ALLOW_ALL_ORIGINS = True
# settings.py

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(env("REDIS_HOST"), 6379)],
        },
    },
}

DJANGO_APPS = [
    "daphne",
    "django.contrib.contenttypes",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
]

THIRD_PARTY_APPS = [
    "raven.contrib.django.raven_compat",
    "rest_framework",
    "rest_framework.authtoken",
    # "knox",
    "django_extensions",
    "django_filters",
    # "cities_light",
    "corsheaders",
    "smart_selects",
    # 'social_django',
    "health_check",  # required
    "health_check.db",  # stock Django health checkers
    "health_check.cache",
    "health_check.storage",
    "modeltranslation",
    # "oauth2_provider",
    "dj_rest_auth",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "allauth.socialaccount.providers.facebook",
    "allauth.socialaccount.providers.github",
    "celery",
]

if importlib.util.find_spec("rosetta") is not None:
    THIRD_PARTY_APPS.append("rosetta")
else:
    logger.warning("django-rosetta is not installed; skipping rosetta app")
ELASTICSEARCH_DSL = {}
ELASTICSEARCH_HOST = os.environ.get("Elastic_Search_Host", "").strip()
if ELASTICSEARCH_HOST:
    THIRD_PARTY_APPS.append("django_elasticsearch_dsl")
    ELASTICSEARCH_DSL = {
        "default": {"hosts": ELASTICSEARCH_HOST},
    }
SECURE_CROSS_ORIGIN_OPENER_POLICY = None
LOCAL_APPS = [
    # "apps.base",
    # "apps.citylight",
    # "apps.db_models",
    # "apps.db_dictionaries",
    # "apps.config",
    "apps.users",
    # "apps.code_list.apps.CodeListConfig",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS + modelApp

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "apps.middleware.user_role.UserRoleMiddleware",
    "apps.middleware.change_db.ChangeDBMiddleware",
    "apps.middleware.logging.LoggingMiddleware",
    # "social_django.middleware.SocialAuthExceptionMiddleware",
]


ROOT_URLCONF = "core.urls"
ASGI_APPLICATION = "core.asgi.application"
WSGI_APPLICATION = "core.wsgi.application"
AUTH_USER_MODEL = "users.User"

TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGE_CODE = "en"
LANGUAGES = (
    ("en", _("English")),
    ("ru", _("Russian")),
    ("de", _("German")),
    # ('tr', _('Turkish')),
)

LOCALE_PATHS = [os.path.join(BASE_DIR, "locale/")]

CITIES_LIGHT_TRANSLATION_LANGUAGES = ["en", "ru"]
CITIES_LIGHT_INCLUDE_COUNTRIES = ["KZ", "CA"]

MODELTRANSLATION_DEFAULT_LANGUAGE = "en"
# # MODELTRANSLATION_TRANSLATIONS_FILES = (
# #     "apps.db_models.translation",
# # )


# STATIC_URL = '/static/'
# STATIC_ROOT = os.path.join(BASE_DIR, 'static_root')
# STATICFILES_DIRS = [
#     os.path.join(BASE_DIR, 'static_dist'),
# ]

STATIC_URL = "/staticfiles/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIR = []
MEDIA_URL = "/mediafiles/"
MEDIA_ROOT = os.path.join(BASE_DIR, "mediafiles")

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
)

# store static files locally and serve with whitenoise
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ############# REST FRAMEWORK ###################

REST_FRAMEWORK = {
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": (
        # "knox.auth.TokenAuthentication",
        "rest_framework.authentication.TokenAuthentication",
        # "rest_framework.authentication.SessionAuthentication",
        # "rest_framework.authentication.BasicAuthentication",
    ),
    # "DEFAULT_PAGINATION_CLASS": ("rest_framework.pagination.PageNumberPagination"),
    # "PAGE_SIZE": 20,
    "DEFAULT_PARSER_CLASSES": (
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ),
    "DATE_FORMAT": "%d-%m-%Y"
    # 'COERCE_DECIMAL_TO_STRING': False # TYPE SORT_ORDER STRING TO DECIMAL
}

# ############ REST KNOX ########################
# REST_KNOX = {
#     "SECURE_HASH_ALGORITHM": "cryptography.hazmat.primitives.hashes.SHA512",
#     "AUTH_TOKEN_CHARACTER_LENGTH": 64,
#     "USER_SERIALIZER": "users.serializers.UserSerializer",
#     "TOKEN_TTL": timedelta(minutes=45),
#     "EXPIRY_DATETIME_FORMAT": api_settings.DATETIME_FORMAT,
# }


CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://{os.environ['REDIS_URI']}",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "SOCKET_TIMEOUT": 900,
        },
    }
}

# SESSION_ENGINE = "django.contrib.sessions.backends.cache"
# SESSION_CACHE_ALIAS = "default"
# SESSION_COOKIE_AGE = 1800
# SESSION_SECURITY_EXPIRE_AFTER=1800

# #Cookie name. this can be whatever you want
# SESSION_COOKIE_NAME='sessionid'  # use the sessionid in your views code
# #the module to store sessions data
# SESSION_ENGINE='django.contrib.sessions.backends.db'
# #age of cookie in seconds (default: 2 weeks)
# SESSION_COOKIE_AGE= 24*60*60*7 # the number of seconds for only 7 for example
# #whether a user's session cookie expires when the web browser is closed
# SESSION_EXPIRE_AT_BROWSER_CLOSE=False
# #whether the session cookie should be secure (https:// only)
# SESSION_COOKIE_SECURE=False

LOGIN_REDIRECT_URL = "/"


ACCOUNT_DEFAULT_HTTP_PROTOCOL = os.environ.get(
    "ACCOUNT_DEFAULT_HTTP_PROTOCOL",
    "http",
)
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_ACTIVATION_DAYS = 7  # days
ACCOUNT_EMAIL_VERIFICATION = "optional"
ACCOUNT_ADAPTER = "apps.users.adapter.NoNewUsersAccountAdapter"
SOCIALACCOUNT_ADAPTER = "apps.users.adapter.FooAppSocialAccountAdapter"
SOCIALACCOUNT_QUERY_EMAIL = True
SOCIALACCOUNT_AUTO_SIGNUP = False

SOCIALACCOUNT_PROVIDERS = {
    "github": {
        "APP": {
            "client_id": env("Github_Client_Id"),  # !!! THIS App ID
            "secret": env("Github_Secret"),  # !!! THIS App Secret
            "key": "",
        },
        "SCOPE": [
            "user",
            "repo",
            "read:org",
        ],
    },
    "google": {
        # For each OAuth based provider, either add a ``SocialApp``
        # (``socialaccount`` app) containing the required client
        # credentials, or list them here:
        "APP": {
            "client_id": env("Google_Client_Id"),
            "secret": env("Google_Secret"),
            "key": env("Google_Key"),
        },
        "AUTH_PARAMS": {
            "access_type": "offline",
        },
    },
    "facebook": {
        "METHOD": "oauth2",
        "SDK_URL": "//connect.facebook.net/{locale}/sdk.js",
        "SCOPE": ["email", "public_profile"],
        "AUTH_PARAMS": {"auth_type": "reauthenticate"},
        "INIT_PARAMS": {"cookie": True},
        "FIELDS": [
            "id",
            "first_name",
            "last_name",
            "name",
            "name_format",
            "picture",
            "short_name",
        ],
        "EXCHANGE_TOKEN": True,
        "LOCALE_FUNC": lambda request: "ru_RU",
        "VERIFIED_EMAIL": False,
        "VERSION": "v7.0",
        # you should fill in 'APP' only if you don't create a Facebook instance at /admin/socialaccount/socialapp/
        "APP": {
            "client_id": env("Facebook_Client_Id"),
            "secret": env("Facebok_Secret"),
            "key": "",
        },
    },
}

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_PORT = env("EMAIL_PORT")
EMAIL_HOST_USER = env("EMAIL_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_PASS")
