import uuid

from django.db import models
from django.utils import timezone


class type(models.Model):
    TYPE = models.CharField(
        max_length=14,
        primary_key=True,
        null=False,
    )
    TYPE_CLASS = models.CharField(
        max_length=50,
        null=False,
    )
    LABEL_ID = models.CharField(
        max_length=100,
        null=True,
    )
    CHANGE_INTERVAL = models.CharField(
        max_length=10,
        null=True,
    )
    LAYER_NAME = models.CharField(
        max_length=50,
        null=False,
    )
    DESCRIPTION_ID = models.CharField(
        max_length=100,
        null=True,
    )
    HIDDEN = models.CharField(
        max_length=5,
        null=True,
    )
    BASE_TYPE = models.CharField(
        max_length=14,
        null=True,
    )
    CODE_LIST_TYPE = models.CharField(
        max_length=50,
        null=True,
    )
    IS_QUICK_LINK = models.CharField(
        max_length=5,
        null=True,
    )
    PROP_TBL_NAME = models.CharField(
        max_length=50,
        null=True,
    )
    BASE_TBL_NAME = models.CharField(
        max_length=50,
        null=True,
    )
    TAG_TBL_NAME = models.CharField(
        max_length=50,
        null=True,
    )
    LAST_UPDT_USER = models.CharField(
        max_length=100,
        null=True,
    )
    LAST_UPDT_DATE = models.BigIntegerField(default=1699356132000)
    VERSION = models.CharField(
        max_length=32,
        default=uuid.uuid4,
        null=False,
    )
    DB_ID = models.CharField(
        max_length=32,
        null=True,
    )
    ROW_ID = models.CharField(
        max_length=32,
        default=uuid.uuid4,
        null=False,
        db_index=True,
    )
    STATUS = models.CharField(
        max_length=10,
        null=True,
    )
    REV_GRP_ID = models.CharField(
        max_length=32,
        null=True,
    )
