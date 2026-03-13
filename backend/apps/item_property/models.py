from django.db import models
import uuid
from django.utils import timezone


class item_property(models.Model):
    ITEM_ID = models.CharField(
        max_length=32,
        primary_key=False,
        null=True,
        db_index=True,
    )
    ITEM_TYPE = models.CharField(
        max_length=14,
        null=True,
        db_index=True,
    )
    LAYER_NAME = models.CharField(
        max_length=50,
        null=True,
    )
    START_DATETIME = models.BigIntegerField(default=1698182986000)
    END_DATETIME = models.BigIntegerField(default=9999999999999)
    PROPERTY_TYPE = models.CharField(
        max_length=15,
        null=True,
        db_index=True,
    )
    PROPERTY_INFO = models.CharField(
        max_length=15,
        null=True,
        db_index=True,
    )
    PROPERTY_VALUE = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
        db_index=True,
    )
    PROPERTY_DATE = models.BigIntegerField(default=1698182986000)
    PROPERTY_STRING = models.CharField(
        max_length=200,
        null=True,
        db_index=True,
    )
    PROPERTY_CODE = models.CharField(
        max_length=32,
        null=True,
        db_index=True,
    )
    PROPERTY_BINARY = models.CharField(
        max_length=32,
        null=True,
        db_index=True,
    )
    LAST_UPDT_USER = models.CharField(
        max_length=100,
        null=True,
    )
    LAST_UPDT_DATE = models.BigIntegerField(default=1698182986000)
    VERSION = models.CharField(
        max_length=32,
        null=True,
    )
    DB_ID = models.CharField(
        max_length=32,
        null=True,
    )
    ROW_ID = models.CharField(
        max_length=32,
        null=True,
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
    UPDATE_SOURCE = models.CharField(
        max_length=1,
        default="x",
        null=True,
    )
    CREATE_SOURCE = models.CharField(
        max_length=1,
        default="x",
        null=True,
    )
