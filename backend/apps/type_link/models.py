from django.db import models
import uuid
from django.utils import timezone


class type_link(models.Model):
    TYPE = models.CharField(
        max_length=14,
        null=False,
    )
    FROM_TYPE = models.CharField(
        max_length=14,
        null=False,
    )
    FROM_TYPE_CLASS = models.CharField(
        max_length=50,
        null=False,
    )
    FROM_CARDINALITY = models.CharField(
        max_length=10,
        null=True,
    )
    TO_TYPE = models.CharField(
        max_length=14,
        null=False,
    )
    TO_TYPE_CLASS = models.CharField(
        max_length=50,
        null=False,
    )
    TO_CARDINALITY = models.CharField(
        max_length=10,
        null=True,
    )
    COLL_TYPE = models.CharField(
        max_length=14,
        null=True,
    )
    COLL_TYPE_CLASS = models.CharField(
        max_length=50,
        null=True,
    )
    SYSTEM = models.CharField(
        max_length=5,
        null=True,
    )
    MANDATORY = models.CharField(
        max_length=5,
        null=True,
    )
    RELATION_EDIT_CLASS = models.CharField(
        max_length=100,
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
        primary_key=True,
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
