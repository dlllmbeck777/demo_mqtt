from .base import *

# import environ

DEBUG = True
# INSTALLED_APPS += ['django_extensions', ]
ALLOWED_HOSTS += [host for host in os.environ.get("DEV_EXTRA_ALLOWED_HOSTS", "").split(" ") if host]

# database routing
DATABASE_ROUTERS = ["core.router.DatabaseAppsRouter"]

DATABASE_APPS_MAPPING = {
    # "users": "default",
    # "db_models": "default",
    "db_dictionaries": "mongodb",
}

DATABASES = {
    "default": {
        "ENGINE": env("PG_ENGINE"),
        "NAME": env("PG_DB"),
        "USER": env("PG_USER"),
        "PASSWORD": env("PG_PASS"),
        "HOST": env("PG_HOST"),
        "PORT": env("PG_PORT"),
    },
    "layer_db": {
        "ENGINE": env("PG_ENGINE"),
        "NAME": env("PG_DB"),
        "USER": env("PG_USER"),
        "PASSWORD": env("PG_PASS"),
        "HOST": env("PG_HOST"),
        "PORT": env("PG_PORT"),
    },
    # "mongodb": {
    #     "NAME": "db_dictionaries",
    #     "ENGINE": "djongo",
    #     "ENFORCE_SCHEMA": True,
    #     'CLIENT': {
    #         'host': 'mongodb://admin:manager@mongodb:27017',
    #     #     'host': 'localhost',
    #     #     'port': 270117,
    #     #     'username': 'admin',
    #     #     'password': 'manager',
    #     #     # 'authSource': 'dictionaries',
    #     #     # 'authMechanism': 'SCRAM-SHA-1'
    #     }
    # },
}

CELERY_BROKER_URL = os.environ.get("CELERY_BROKER", "redis://redis:6379/1")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_BACKEND", "redis://redis:6379/1")
