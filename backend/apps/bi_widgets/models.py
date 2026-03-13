from django.db import models
import uuid
from django.utils import timezone

# Create your models here.
class bi_widget(models.Model):
    WIDGET_ID = models.CharField(
        max_length=32,
        primary_key=True,
        null=False,
    )
    WIDGET_TYPE = models.CharField(
        max_length=50,
        null=False,
        db_index=True,
    )
    START_DATETIME = models.DateField(
        null=False,
        db_index=True,
    )
    END_DATETIME = models.DateField(
        null=False,
        db_index=True,
    )
    LAST_UPDT_USER = models.CharField(
        max_length=100,
        null=True,
    )
    LAST_UPDT_DATE = models.DateField(
        null=True,
    )
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
        db_index=True,
    )
    STATUS = models.CharField(
        max_length=10,
        null=True,
    )
    LAYER_NAME = models.CharField(
        max_length=50,
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
