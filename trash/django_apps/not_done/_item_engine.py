from django.db import models
import uuid
from ._base_equip import Base_equip

class Engine(Base_equip):
    pass
    # manufacturer = models.ForeignKey('type_manufacturer', on_delete=models.CASCADE, blank=True, null=True, verbose_name='Type')

class Meta:
    db_table = 'engine'
    app_label = 'app.db_models'
    ordering = ["name"]
    verbose_name = "enginer"
    verbose_name_plural = "engines"