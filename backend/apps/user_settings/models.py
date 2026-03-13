from django.db import models


# Create your models here.
class user_settings(models.Model):
    email_notification = models.BooleanField(null=False, default=False)
    font_size = models.DecimalField(max_digits=28, decimal_places=12, default=14)
    font_weight = models.DecimalField(max_digits=28, decimal_places=12, default=400)
    overview_orientation = models.CharField(
        max_length=500, null=False, default="vertical"
    )
    thema = models.CharField(max_length=500, null=False, default="light")
    language = models.CharField(max_length=500, null=False, default="English (US)")
    full_screen = models.BooleanField(null=False, default=False)
    ROW_ID = models.CharField(max_length=100, null=True)
    drawer_settings = models.JSONField(null=True)
    item_settings = models.JSONField(null=True)
    overview_settings = models.JSONField(null=True)
    others_settings = models.JSONField(null=True)
    alarm_notification = models.BooleanField(null=False, default=True)
    USER = models.CharField(max_length=100, null=True, unique=True)
