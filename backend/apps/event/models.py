from django.db import models
from django.utils import timezone


class event(models.Model):
    log_type = models.CharField(max_length=255, null=True)
    error_message = models.TextField(null=True)
    layer = models.CharField(max_length=255, null=True)
    priority = models.IntegerField(null=True)
    source = models.CharField(max_length=250, null=True)
    measurement = models.CharField(max_length=255, null=True)
    tag_value = models.FloatField(null=True)
    tag_quality = models.IntegerField(null=True)
    gap = models.FloatField(null=True)
    gap_type = models.CharField(max_length=255, null=True)
    asset = models.CharField(max_length=255, null=True)
    category = models.CharField(max_length=255, null=True)
    state = models.CharField(max_length=255, null=True)
    is_read = models.BooleanField(null=True)
    short_name = models.CharField(max_length=255, null=True)
    interval = models.CharField(max_length=255, null=True)
    id = models.CharField(max_length=255, primary_key=True)
    time = models.BigIntegerField(null=True)
