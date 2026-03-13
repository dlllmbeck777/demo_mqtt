from django.db import models
from django.utils import timezone


# class test(models.Model):
class item_event(models.Model):
    EVENT_GROUP_ID = models.CharField(
        max_length=32,
        null=False,
        db_index=True,
    )
    ITEM_ID = models.CharField(
        max_length=32,
        null=False,
        db_index=True,
    )
    EVENT_TYPE = models.CharField(
        max_length=32,
        null=False,
    )
    PERIOD = models.CharField(
        max_length=20,
        null=False,
    )
    START_DATETIME = models.BigIntegerField(null=False)
    END_DATETIME = models.BigIntegerField(null=False)
    VAL1 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL2 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL3 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL4 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL5 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL6 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL7 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL8 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL9 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL10 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL11 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL12 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL13 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL14 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL15 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL16 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL17 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL18 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL19 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL20 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL21 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL22 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL23 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL24 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL25 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL26 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL27 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL28 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL29 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL30 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL31 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL32 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL33 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL34 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL35 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL36 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL37 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL38 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL39 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL40 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL41 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL42 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL43 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL44 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL45 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL46 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL47 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL48 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL49 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL50 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL51 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL52 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL53 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL54 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL55 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL56 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL57 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL58 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL59 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL60 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL61 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL62 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL63 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL64 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL65 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL66 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL67 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL68 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL69 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL70 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL71 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL72 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL73 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL74 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    VAL75 = models.DecimalField(max_digits=28, decimal_places=12, null=True)
    DATE1 = models.BigIntegerField(null=True)
    DATE2 = models.BigIntegerField(null=True)
    DATE3 = models.BigIntegerField(null=True)
    DATE4 = models.BigIntegerField(null=True)
    DATE5 = models.BigIntegerField(null=True)
    DATE6 = models.BigIntegerField(null=True)
    CHAR1 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR2 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR3 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR4 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR5 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR6 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR7 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR8 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR9 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR10 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR11 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR12 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR13 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR14 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR15 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR16 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR17 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR18 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR19 = models.CharField(
        max_length=10000,
        null=True,
    )
    CHAR20 = models.CharField(
        max_length=10000,
        null=True,
    )
    PDF_FILE = models.BinaryField(null=True)
    PDF_FILE_NAME = models.CharField(max_length=100, null=True)
    LAST_UPDT_USER = models.CharField(max_length=100, null=True)
    LAST_UPDT_DATE = models.BigIntegerField()
    VERSION = models.CharField(max_length=32)
    DB_ID = models.CharField(max_length=32, null=True)
    ROW_ID = models.CharField(max_length=32)
    STATUS = models.CharField(max_length=10, null=True)
    REV_GRP_ID = models.CharField(max_length=32, null=True)
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
