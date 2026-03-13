from django.db import models
from django.utils.translation import gettext_lazy as _
from ._base_equip import Base_equip

class Compressor(Base_equip):
   battery_id = models.ForeignKey('battery', on_delete=models.CASCADE)
   cumulative_m= models.CharField(db_column='cumulative_m', max_length=15  ,blank=True)
   disc_press_meas= models.BooleanField(db_column='disc_press_meas',blank=True)
   disc_temp_meas= models.BooleanField(db_column='disc_temp_meas',blank=True)
   last_service= models.DateTimeField(db_column='last_service',auto_now=False, auto_now_add=False,blank=True)
   rollover= models.DecimalField(db_column='rollover', max_digits=12, decimal_places=8,blank=True)
   rollover_uom= models.CharField(db_column='rollover_uom', max_length=15  ,blank=True)
   seal_press_meas= models.BooleanField(db_column='seal_press_meas',blank=True)
   stages= models.DecimalField(db_column='stages', max_digits=12, decimal_places=8,blank=True)
   suct_press_meas= models.BooleanField(db_column='suct_press_meas',blank=True)
   suct_temp_meas= models.BooleanField(db_column='suct_temp_meas',blank=True)
   type= models.CharField(db_column='type', max_length=15  ,blank=True)
   # stop_id = models.ForeignKey('pgdbmodel.Stop', on_delete=models.CASCADE)
   # switch_id = models.ForeignKey('pgdbmodel.Switch', on_delete=models.CASCADE)
   # route_many_id = models.ManyToManyField('pgdbmodel.Route', through='pgdbmodel.Route_itemref_compressor')


   def __str__(self):
      if self.cumulative_m:
         return self.cumulative_m
      if self.rollover_uom:
         return self.rollover_uom
      if self.type:
         return self.type
         
class Meta:            
      ordering = ["name"]
      verbose_name = _("compressor")
      verbose_name_plural = _("compressors")
      