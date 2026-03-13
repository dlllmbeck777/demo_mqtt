from django.db import models
import uuid
from django.utils import timezone
from apps.bi_widgets.models import bi_widget
from apps.tags.models import tags
from apps.tags_calculated.models import tags_calculated

"""
 "Transaction Property": [
    [
      "fc817687be604c0c90bfa01fab82f687",
      "304",
      5
    ]
  ],

  bunu 3 parça şeklinde ekleyeceğiz property type transaction property value sıra sıra 1,2,3
  tagslarda proptype inputs olarak alırız

"""


class bi_widget_property(models.Model):
    WIDGET_ID = models.ManyToManyField(bi_widget, related_name="property")
    WIDGET_TYPE = models.CharField(
        max_length=14,
        null=True,
        db_index=True,
    )
    PROPERTY_NAME = models.CharField(
        max_length=1000,
        null=True,
        db_index=True,
    )
    LAYER_NAME = models.CharField(
        max_length=50,
        null=True,
    )
    START_DATETIME = models.DateField(
        null=True,
        db_index=True,
    )
    END_DATETIME = models.DateField(
        null=True,
        db_index=True,
    )
    PROPERTY_TAG = models.ManyToManyField(tags, related_name="tags", blank=True)
    PROPERTY_TAG_CAL = models.ManyToManyField(
        tags_calculated, related_name="tags_calculated", blank=True
    )
    PROPERTY_TYPE = models.CharField(
        max_length=155,
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
    PROPERTY_STRING = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        db_index=True,
    )
    PROPERTY_JSON = models.JSONField(null=True)
    PROPERTY_BINARY = models.CharField(
        max_length=32,
        null=True,
        db_index=True,
    )
    PROPERTY_BOOLEAN = models.BooleanField(
        max_length=32,
        null=True,
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
