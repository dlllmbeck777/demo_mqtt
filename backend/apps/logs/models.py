from django.db import models
from django.utils import timezone


class logs(models.Model):
    log_type = models.CharField(max_length=255)
    error_message = models.TextField(null=True)
    layer = models.CharField(max_length=255, null=True)
    priority = models.IntegerField(null=True)
    source = models.CharField(max_length=255, null=True)
    category = models.CharField(max_length=255, null=True)
    state = models.CharField(max_length=255, null=True)
    user = models.CharField(max_length=250, null=True)
    is_read = models.BooleanField()
    id = models.CharField(max_length=255, primary_key=True)
    time = models.BigIntegerField()
