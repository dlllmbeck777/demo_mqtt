from django.db import models
import uuid
from django.utils import timezone


class item_link(models.Model):
    LINK_ID = models.CharField(
        max_length=32,
        default=uuid.uuid4,
        null=False,
        db_index=True,
    )
    LINK_TYPE = models.CharField(
        max_length=14,
        null=False,
        db_index=True,
    )
    START_DATETIME = models.BigIntegerField(default=1698182986000)
    END_DATETIME = models.BigIntegerField(default=9999999999999)
    FROM_ITEM_ID = models.CharField(
        max_length=32,
        null=False,
        db_index=True,
    )
    FROM_ITEM_TYPE = models.CharField(
        max_length=14,
        null=False,
        db_index=True,
    )
    TO_ITEM_ID = models.CharField(
        max_length=32,
        null=False,
        db_index=True,
    )
    TO_ITEM_TYPE = models.CharField(
        max_length=14,
        null=False,
        db_index=True,
    )
    COLL_ITEM_ID = models.CharField(
        max_length=32,
        null=True,
        db_index=True,
    )
    COLL_ITEM_TYPE = models.CharField(
        max_length=14,
        null=True,
        db_index=True,
    )
    LAST_UPDT_USER = models.CharField(
        max_length=100,
        null=True,
    )
    LAST_UPDT_DATE = models.BigIntegerField(default=1698182986000)
    LAYER_NAME = models.CharField(
        max_length=50,
        null=False,
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
