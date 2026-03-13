import uuid

from django.db import models
from django.utils import timezone


class workflows(models.Model):
    NAME = models.CharField(max_length=50, null=False, db_index=True)
    CODE = models.CharField(max_length=100, null=False, db_index=True)
    TYPE = models.CharField(max_length=14, null=False)
    ITEM_ID = models.JSONField(default=list)
    TAG_ID = models.JSONField(default=list)
    LAST_UPDT_USER = models.CharField(max_length=100, null=True)
    LAST_UPDT_DATE = models.DateField(
        default=str(timezone.now()).split(" ")[0], null=True
    )
    VERSION = models.CharField(max_length=32, null=False)
    DB_ID = models.CharField(max_length=32, null=True)
    ROW_ID = models.CharField(
        max_length=32, null=False, db_index=True, primary_key=True
    )
    STATUS = models.CharField(max_length=10, null=True)
    LAYER_NAME = models.CharField(max_length=50, null=False)
    REV_GRP_ID = models.CharField(max_length=32, null=True)
