from django.db import models
from django.utils import timezone
from apps.bi_widgets.models import bi_widget
from apps.item.models import item


class bi_dashboard(models.Model):
    NAME = models.CharField(max_length=1000)
    WIDGETS = models.ManyToManyField(bi_widget, related_name="widgets", blank=True)
    CULTURE = models.CharField(
        max_length=10,
        null=False,
        db_index=True,
    )
    LAYER_NAME = models.CharField(
        max_length=50,
        null=False,
    )
    DASHBOARD_USER = models.JSONField(
        null=True,
    )
    START_DATETIME = models.DateField(null=True, db_index=True, default="2023-01-01")
    ITEM_ID = models.ForeignKey(item, on_delete=models.CASCADE, null=True)
    ROW_ID = models.CharField(max_length=32, null=True, default="*****")
