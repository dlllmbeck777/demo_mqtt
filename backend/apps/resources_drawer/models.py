import uuid
from .helpers import set_child_by_culture
from django.db import models
from django.utils import timezone


class MyQuerySet(models.QuerySet):
    def bulk_create(self, objs, batch_size=None, ignore_conflicts=False):
        # Özel işlemlerinizi buraya ekleyin
        super().bulk_create(objs, batch_size, ignore_conflicts)
        cultures = resources_drawer.objects.distinct("CULTURE").values_list(
            "CULTURE", flat=True
        )
        for culture in cultures:
            set_child_by_culture(resources_drawer, culture)


class MyModelManager(models.Manager):
    def get_queryset(self):
        return MyQuerySet(self.model, using=self._db)


class resources_drawer(models.Model):
    CULTURE = models.CharField(
        max_length=10, primary_key=False, null=False, db_index=True
    )
    ID = models.CharField(max_length=100, null=False, primary_key=False)
    PATH = models.CharField(
        max_length=200,
        null=True,
    )
    SHORT_LABEL = models.CharField(
        max_length=200,
        null=True,
    )
    MOBILE_LABEL = models.CharField(
        max_length=200,
        null=True,
    )
    LAYER_LEVEL = models.DecimalField(
        max_digits=18,
        decimal_places=0,
        null=True,
    )
    ICON = models.CharField(
        max_length=100,
        null=True,
    )
    CHILD = models.ManyToManyField(
        "self", blank=True, symmetrical=False, related_name="child"
    )
    LAYER_NAME = models.CharField(
        max_length=50,
        null=False,
    )
    IS_ITEM = models.CharField(
        max_length=50,
        null=True,
    )
    HIDDEN = models.CharField(
        max_length=10,
        null=True,
    )
    LAST_UPDT_USER = models.CharField(
        max_length=100,
        null=True,
    )

    LAST_UPDT_DATE = models.BigIntegerField(default=1699356132000)
    VERSION = models.CharField(
        max_length=32,
        default=uuid.uuid4().hex,
        null=False,
    )
    DB_ID = models.CharField(
        max_length=32,
        null=True,
    )
    ROW_ID = models.CharField(
        max_length=32,
        default=uuid.uuid4().hex,
        null=False,
        db_index=True,
    )
    STATUS = models.CharField(
        max_length=10,
        null=True,
    )
    SORT_ORDER = models.DecimalField(
        max_digits=18,
        decimal_places=0,
        null=True,
    )
    REV_GRP_ID = models.CharField(
        max_length=32,
        null=True,
    )  # used as user permission number

    objects = MyModelManager()
