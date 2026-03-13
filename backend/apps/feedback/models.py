from django.db import models
import uuid
from django.utils import timezone


class feedback(models.Model):
    NAME = models.CharField(max_length=100, null=False)
    COMPANY_NAME = models.CharField(max_length=100, null=False)
    EMAIL = models.CharField(max_length=100, null=False)
    PHONE_NUMBER = models.CharField(max_length=100, null=False)
    MESSAGE = models.CharField(
        max_length=5000,
        null=False,
    )
    ROW_ID = models.CharField(max_length=32)
