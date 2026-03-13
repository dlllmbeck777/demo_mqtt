import uuid

from django.db import models
from django.utils import timezone


class type_property(models.Model):
    TYPE = models.CharField(
        max_length=14,
        primary_key=False,
        null=False,
    )
    PROPERTY_NAME = models.CharField(
        max_length=50,
        null=False,
    )
    PROP_GRP = models.CharField(
        max_length=50,
        null=True,
    )
    PROP_GRP_PRNT = models.CharField(
        max_length=50,
        null=True,
    )
    LABEL_ID = models.CharField(
        max_length=100,
        null=True,
    )
    TABLE_NAME = models.CharField(
        max_length=50,
        null=True,
    )
    COLUMN_NAME = models.CharField(
        max_length=50,
        null=True,
    )
    PROPERTY_TYPE = models.CharField(
        max_length=100,
        null=True,
    )
    PROPERTY_CLASS = models.CharField(
        max_length=100,
        null=True,
    )
    UNICODE = models.CharField(
        max_length=5,
        null=True,
    )
    CODE_LIST = models.CharField(
        max_length=100,
        null=True,
    )
    CODE_LIST_FLTR = models.CharField(
        max_length=100,
        null=True,
    )
    CODE_LIST_LVL = models.DecimalField(
        max_digits=18,
        decimal_places=0,
        null=True,
    )
    PARENT_CL_PROP = models.CharField(
        max_length=15,
        null=True,
    )
    VALUE_FILTER = models.CharField(
        max_length=100,
        null=True,
    )
    UI_EDIT_CLASS = models.CharField(
        max_length=100,
        null=True,
    )
    SORT_ORDER = models.DecimalField(
        max_digits=18,
        decimal_places=0,
        null=True,
    )
    MANDATORY = models.CharField(
        max_length=5,
        null=True,
    )
    HIDDEN = models.CharField(
        max_length=5,
        null=True,
    )
    IS_KEY = models.CharField(
        max_length=5,
        null=True,
    )
    LENGTH = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    DECIMALS = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    UOM = models.CharField(
        max_length=50,
        null=True,
    )
    CHANGE_INTERVAL = models.CharField(
        max_length=10,
        default="CH",
        null=True,
    )
    DEFAULT_VALUE = models.CharField(
        max_length=50,
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
    PROP_UNIQUE = models.CharField(
        max_length=20,
        null=True,
    )
    ALLOW_MULTI_EDIT = models.CharField(
        max_length=5,
        null=True,
    )
    READ_ONLY = models.CharField(
        max_length=5,
        null=True,
    )
    DEF_ACCUM_FUNC = models.CharField(
        max_length=20,
        null=True,
    )
