from django.db import models
from django.utils.translation import gettext_lazy as _
from .model_base_equip import Base_equip
from .model_base_geo import Base_geo


class Battery(Base_equip, Base_geo):
    company_ref = models.ForeignKey(
        "company",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name=_("Company Ref.")
    )
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
    battery_type = models.CharField(
        verbose_name=_("Battery Type"),
        max_length=100,
        blank=True, 
        null=True
    )
    day_start = models.DateTimeField(
        verbose_name=_("Prod. Start"),
        auto_now_add=False, 
        blank=True, 
        null=True,         
    )

    def __str__(self):
        if self.battery_type:
            return self.battery_type

    class Meta:
        ordering = ["name"]
        verbose_name = _("battery")
        verbose_name_plural = _("batteries")
