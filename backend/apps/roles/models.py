from django.db import models
from apps.roles_property.models import roles_property


class MyQuerySet(models.QuerySet):
    def bulk_create(self, objs, batch_size=None, ignore_conflicts=False):
        for obj in objs:
            propertys = obj.pop("PROPERTY_ID", [])
            instance = self.model(**obj)
            instance.save()
            roles_property.objects.bulk_create(
                [roles_property(**item) for item in propertys]
            )

            property_ids = [ids["ROW_ID"] for ids in propertys]
            instance.PROPERTY_ID.set(property_ids)
        # print("bitti")


class MyModelManager(models.Manager):
    def get_queryset(self):
        return MyQuerySet(self.model, using=self._db)


# Create your models here.
class roles(models.Model):
    PROPERTY_ID = models.ManyToManyField(roles_property, related_name="roles")
    ROLES_ID = models.CharField(max_length=32, primary_key=True, null=False)
    ROLES_NAME = models.CharField(max_length=100, null=False, default="NAME")
    LAYER_NAME = models.CharField(max_length=100, null=False, default="LAYER")
    LAST_UPDT_DATE = models.BigIntegerField(default=1699356132000)
    LAST_UPDATE_USER = models.CharField(max_length=100)
    objects = MyModelManager()
