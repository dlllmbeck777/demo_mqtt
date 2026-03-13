from django.db import models
import uuid
from django.utils import timezone


class layer(models.Model):
    LAYER_NAME = models.CharField(
        max_length=100,
        primary_key=True,
        null=False,
    )
    DATA_SOURCE = models.CharField(
        max_length=100,
        null=True,
    )
    LAYER_LEVEL = models.CharField(
        max_length=100,
        null=False,
    )
    DB_SETTINGS = models.JSONField(null=True)
    LAST_UPDT_USER = models.CharField(
        max_length=100,
        null=True,
    )

    LAST_UPDT_DATE = models.BigIntegerField(default=1699356132000)

    VERSION = models.CharField(
        max_length=32,
        null=False,
    )
    DB_ID = models.CharField(
        max_length=32,
        null=True,
    )
    ROW_ID = models.CharField(
        max_length=32,
        null=False,
    )
    STATUS = models.CharField(
        max_length=10,
        null=True,
    )
    REV_GRP_ID = models.CharField(
        max_length=32,
        null=True,
    )
