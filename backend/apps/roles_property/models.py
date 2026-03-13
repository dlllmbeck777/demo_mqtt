from django.db import models


class roles_property(models.Model):
    ROLES_TYPES = models.CharField(max_length=100, null=False)
    ROLES_INFO = models.CharField(max_length=100, null=True)
    CREATE = models.BooleanField(default=False)
    READ = models.BooleanField(default=False)
    UPDATE = models.BooleanField(default=False)
    DELETE = models.BooleanField(default=False)
    LAST_UPDT_DATE = models.BigIntegerField(default=1699356132000)
    PARENT = models.CharField(max_length=100, null=True)
    ROW_ID = models.CharField(max_length=32, primary_key=True, null=False)
