from django.db import models
import uuid
from django.utils import timezone
from apps.item_link.serializers import ItemLinkSaveSerializer
import environ
import redis

env = environ.Env(DEBUG=(bool, False))
rds = redis.StrictRedis(env("REDIS_HOST"), port=6379, db=0)
from django.db.utils import IntegrityError
import json


# Create your models here.
class tags_calculated(models.Model):
    ITEM_ID = models.CharField(
        max_length=32,
        default=uuid.uuid4().hex,
        null=False,
        db_index=True,
    )
    EVENT_TYPE = models.CharField(
        max_length=14,
        null=False,
    )
    TAG_ID = models.CharField(
        max_length=32,
        default=uuid.uuid4().hex,
        null=False,
    )

    START_DATETIME = models.BigIntegerField(default=1672520400)

    PARENT_TAG_ID = models.CharField(
        max_length=32,
        null=True,
    )
    SHORT_NAME = models.CharField(
        max_length=100,
        null=True,
    )
    NAME = models.CharField(
        max_length=100,
        null=True,
    )
    OPERATIONS_TYPE = models.CharField(
        max_length=100,
        null=True,
    )
    DESCRIPTION = models.CharField(
        max_length=1000,
        null=True,
    )
    UOM_CODE = models.CharField(
        max_length=250,
        null=True,
    )
    DATA_TYPE = models.CharField(
        max_length=100,
        null=True,
    )
    DERIVE_EQUATION = models.CharField(
        max_length=1000,
        null=True,
    )
    EXCEPTION_DEV = models.CharField(
        max_length=1000,
        null=True,
    )
    EXCEPTION_DEV_TYPE = models.CharField(
        max_length=1000,
        null=True,
    )
    NODE_NAME = models.CharField(
        max_length=100,
        null=True,
    )
    PROCESS_NAME = models.CharField(
        max_length=100,
        null=True,
    )
    SOURCE_NAME = models.CharField(
        max_length=100,
        null=True,
    )
    STEPPED = models.CharField(
        max_length=100,
        null=True,
    )
    DATA_ACCESS_TYPE = models.CharField(
        max_length=200,
        null=True,
    )
    LAYER_NAME = models.CharField(
        max_length=50,
        null=False,
    )
    NODE_DUMP = models.CharField(
        max_length=2000,
        null=True,
    )
    NORMAL_MAXIMUM = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    NORMAL_MINIMUM = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    LIMIT_LOLO = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    LIMIT_HIHI = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    EVENT_NOTIFIER = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    NODE_CLASS = models.CharField(
        max_length=20,
        null=True,
    )
    HISTORIZING = models.CharField(
        max_length=10,
        null=True,
    )
    MINIMUM_SAMPLING_INTERVAL = models.DecimalField(
        max_digits=28, decimal_places=12, null=True
    )
    PERIOD = models.CharField(
        max_length=20,
        null=True,
    )

    END_DATETIME = models.BigIntegerField(default=9999999999000)
    LAST_UPDT_USER = models.CharField(
        max_length=100,
        null=True,
    )
    LAST_UPDT_DATE = models.BigIntegerField(default=1672520400000)
    VERSION = models.CharField(
        max_length=32,
        default=uuid.uuid4().hex,
        null=True,
    )
    DB_ID = models.CharField(
        max_length=32,
        null=True,
    )
    ROW_ID = models.CharField(
        max_length=32,
        default=uuid.uuid4().hex,
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
    TRANSACTION_TYPE = models.CharField(
        max_length=2000,
        null=True,
    )
    TRANSACTION_PROPERTY = models.CharField(
        max_length=2000,
        null=True,
    )
    UPDATE_SOURCE = models.CharField(
        max_length=100,
        default="x",
        null=True,
    )
    CREATE_SOURCE = models.CharField(
        max_length=100,
        default="x",
        null=True,
    )
