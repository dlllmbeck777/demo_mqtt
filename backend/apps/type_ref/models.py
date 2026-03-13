import uuid

from django.db import models
from django.utils import timezone


class type_ref(models.Model):
    TYPE = models.CharField(
        max_length=100,
        null=False,
    )
    PROPERTY_NAME = models.CharField(
        max_length=50,
        null=False,
    )
    VALID_TYPE = models.CharField(
        max_length=250,
        null=False,
    )
    HIDDEN = models.CharField(
        max_length=5,
        null=True,
    )
    DESCRIPTION_ID = models.CharField(
        max_length=250,
        null=True,
    )
    LAYER_NAME = models.CharField(
        max_length=50,
        null=False,
    )
    ROW_ID = models.CharField(max_length=32, null=False, primary_key=True)
    LAST_UPDT_USER = models.CharField(
        max_length=100,
        null=True,
    )
    LAST_UPDT_DATE = models.DateField(
        default=timezone.now,
        null=True,
    )
    VERSION = models.CharField(
        max_length=32,
        default=uuid.uuid4,
        null=False,
    )
    DB_ID = models.CharField(
        max_length=32,
        null=True,
    )
    STATUS = models.CharField(
        max_length=10,
        null=True,
    )
    REV_GRP_ID = models.CharField(
        max_length=32,
        null=True,
    )
