from django.db import models
import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from .model_base_equip import Base_equip
from .model_base_geo import Base_geo

class Completion(Base_equip, Base_geo):
    field_ref = models.ForeignKey(
        "field",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        verbose_name=_("Field Ref.")
    )
    battery_ref = models.ForeignKey(
        "battery",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        verbose_name=_("Battery Ref.")
    )
    comp_type= models.CharField(verbose_name=_("Comp. Type"), max_length=100, blank=True, null=True)
    disp_type= models.CharField(verbose_name=_("Disp. Type"), max_length=100, blank=True, null=True)
    inv_method= models.CharField(verbose_name=_("Inv. Method"), max_length=100, blank=True, null=True)
    lift_type= models.CharField(verbose_name=_("Lift Type"), max_length=100, blank=True, null=True)
    recovery= models.CharField(verbose_name=_("Recovery"), max_length=100, blank=True, null=True)
    
    bot_x= models.DecimalField(verbose_name=_("bot_x"), max_digits=100, decimal_places=8, blank=True, null=True)
    bot_y= models.DecimalField(verbose_name=_("bot_y"), max_digits=100, decimal_places=8, blank=True, null=True)
    completion_md= models.DecimalField(verbose_name=_("completion_md"), max_digits=100, decimal_places=8, blank=True, null=True)
    completion_tvd= models.DecimalField(verbose_name=_("completion_tvd"), max_digits=100, decimal_places=8, blank=True, null=True)
    
    api= models.CharField(verbose_name=_("API"), max_length=100, blank=True, null=True)
    cgr= models.DecimalField(verbose_name=_("CGR"), max_digits=100, decimal_places=8, blank=True, null=True)
    gor= models.DecimalField(verbose_name=_("GOR"), max_digits=100, decimal_places=8, blank=True, null=True)
    wgr= models.DecimalField(verbose_name=_("WGR"), max_digits=100, decimal_places=8, blank=True, null=True)
    wor= models.DecimalField(verbose_name=_("WOR"), max_digits=100, decimal_places=8, blank=True, null=True)

    gas_density= models.DecimalField(verbose_name=_("Gas Density"), max_digits=100, decimal_places=8, blank=True, null=True)
    gas_shrink= models.DecimalField(verbose_name=_("Gas Shrink"), max_digits=100, decimal_places=8, blank=True, null=True)
    ngl_frac= models.DecimalField(verbose_name=_("NGL Frac"), max_digits=100, decimal_places=8, blank=True, null=True)
    oil_density= models.DecimalField(verbose_name=_("Oil Density"), max_digits=100, decimal_places=8, blank=True, null=True)
    
    cond_theor_m= models.CharField(verbose_name=_("Cond Theo. Method"), max_length=100, blank=True, null=True)
    gas_theor_m= models.CharField(verbose_name=_("Gas Theo. Method"), max_length=100, blank=True, null=True)
    oil_theor_m= models.CharField(verbose_name=_("Oil Theo. Method"), max_length=100, blank=True, null=True)
    water_theor_m= models.CharField(verbose_name=_("Water Theo. Method"), max_length=100, blank=True, null=True)
    
    reservoir_phase= models.CharField(verbose_name=_("Reservoir Phase"), max_length=15, blank=True, null=True)
    reservoir_type= models.CharField(verbose_name=_("Reservoir Type"), max_length=15, blank=True, null=True)
        
    def __str__(self):
        if self.disp_type:
           return self.disp_type
        if self.inv_method:
           return self.inv_method
        if self.lift_type:
           return self.lift_type
        if self.recovery:
           return self.recovery
        if self.api:
           return self.api
        if self.cond_theor_m:
           return self.cond_theor_m
        if self.gas_theor_m:
           return self.gas_theor_m
        if self.oil_theor_m:
           return self.oil_theor_m
        if self.water_theor_m:
           return self.water_theor_m
        if self.lease:
           return self.lease
        if self.reservoir_phase:
           return self.reservoir_phase
        if self.reservoir_type:
           return self.reservoir_type

    class Meta:
        ordering = ["name"]
        verbose_name = _("completion")
        verbose_name_plural = _("completions")