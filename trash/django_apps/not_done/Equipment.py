from django.db import models
import uuid
from pgdbmodel.models.Equip_base import Equip_base
class Equipment(Equip_base):
    engine_id = models.ForeignKey('pgdbmodel.Engine', on_delete=models.CASCADE)
    route_many_id = models.ManyToManyField('pgdbmodel.Route', through='pgdbmodel.Route_itemref_equipment')
    product= models.CharField(db_column='product', max_length=15  ,blank=True)
    purpose= models.CharField(db_column='purpose', max_length=15  ,blank=True)
    type= models.CharField(db_column='type', max_length=15  ,blank=True)
    def __str__(self):
        if self.product:
           return self.product
        if self.purpose:
           return self.purpose
        if self.type:
           return self.type
class Meta:
      db_table = 'Equipment'