import uuid
from django.db import models
from django.utils import timezone


class uom_base_unit(models.Model):
    CULTURE = models.CharField(
        max_length=10,
        primary_key=False,
        null=True,
    )
    NAME = models.CharField(max_length=1000, null=False, db_index=True)
    QUANTITY_TYPE = models.CharField(max_length=1000, null=True)
    CATALOG_NAME = models.CharField(max_length=1000, null=False)
    CATALOG_SYMBOL = models.CharField(max_length=1000, null=False)
    RP66_SYMBOL = models.CharField(max_length=1000, null=True)
    BASE_UNIT = models.CharField(max_length=1000, null=True)
    LAST_UPDT_USER = models.CharField(
        max_length=100,
        null=True,
    )
    CODE = models.CharField(
        max_length=500,
        null=True,
    )
    LAST_UPDT_DATE = models.BigIntegerField(null=True, default=1699018031000)
    VERSION = models.CharField(
        max_length=32,
        default=uuid.uuid4().hex,
        null=False,
    )
    DB_ID = models.CharField(
        max_length=32,
        null=True,
    )
    ROW_ID = models.CharField(
        max_length=32,
        default=uuid.uuid4().hex,
        null=False,
        db_index=True,
    )
    STATUS = models.CharField(
        max_length=10,
        null=True,
    )
    LAYER_NAME = models.CharField(
        max_length=50,
        null=False,
    )
    REV_GRP_ID = models.CharField(
        max_length=32,
        null=True,
    )
