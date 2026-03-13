from django.db import models

# Create your models here.


class bi_widget_type(models.Model):
    WIDGET_TYPE = models.CharField(
        max_length=500,
        null=True,
        db_index=True,
    )
    properties = models.JSONField(null=True)
