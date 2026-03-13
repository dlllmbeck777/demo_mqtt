from django.db import models
import uuid
from django.utils import timezone


class code_list(models.Model):
    LIST_TYPE = models.CharField(
        max_length=100,
        null=False,
        db_index=True,
    )
    CULTURE = models.CharField(
        max_length=10,
        default="Culture",
        null=False,
        db_index=True,
    )
    CODE = models.CharField(
        max_length=100,
        null=False,
        db_index=True,
    )
    CODE_TEXT = models.CharField(
        max_length=100,
        null=True,
        db_index=True,
    )
    PARENT = models.CharField(
        max_length=100,
        null=True,
        db_index=True,
    )
    LEGACY_CODE = models.CharField(
        max_length=50,
        null=True,
    )
    VAL1 = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    VAL2 = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    VAL3 = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    VAL4 = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    VAL5 = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    VAL6 = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    VAL7 = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    VAL8 = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    VAL9 = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    VAL10 = models.DecimalField(
        max_digits=28,
        decimal_places=12,
        null=True,
    )
    DATE1 = models.DateField(
        null=True,
    )
    DATE2 = models.DateField(
        null=True,
    )
    DATE3 = models.DateField(
        null=True,
    )
    DATE4 = models.DateField(
        null=True,
    )
    DATE5 = models.DateField(
        null=True,
    )
    CHAR1 = models.CharField(
        max_length=1000,
        null=True,
    )
    CHAR2 = models.CharField(
        max_length=1000,
        null=True,
    )
    CHAR3 = models.CharField(
        max_length=1000,
        null=True,
    )
    CHAR4 = models.CharField(
        max_length=1000,
        null=True,
    )
    CHAR5 = models.CharField(
        max_length=1000,
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

    LAST_UPDT_DATE = models.BigIntegerField(null=True, default=1697757191000)
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
        primary_key=True,
        null=False,
    )
    STATUS = models.CharField(
        max_length=10,
        null=True,
    )
    REV_GRP_ID = models.CharField(
        max_length=32,
        null=True,
    )

    class Meta:
        indexes = [
            models.Index(fields=["LIST_TYPE"]),
            models.Index(fields=["CULTURE"]),
            models.Index(fields=["CODE"]),
            models.Index(fields=["CODE_TEXT"]),
            models.Index(fields=["PARENT"]),
        ]
