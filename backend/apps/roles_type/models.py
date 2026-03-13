from django.db import models


class roles_type(models.Model):
    ROLES_TYPES = models.CharField(max_length=100, null=False)
    PARENT = models.CharField(max_length=100, null=True)
    ROLES_INFO = models.CharField(max_length=100, null=False)
    CREATE = models.BooleanField(default=False)
    READ = models.BooleanField(default=False)
    UPDATE = models.BooleanField(default=False)
    DELETE = models.BooleanField(default=False)
    ROW_ID = models.CharField(max_length=32, primary_key=True, null=False)
