from django.db import models
from django.utils.translation import gettext_lazy as _
from .model_base_domain import Base_domain

class Base_equip(Base_domain):
    status = models.CharField(
        verbose_name=_("Status"),
        max_length=100,
        blank=True,
        null=True
    )
    product = models.CharField(
        verbose_name=_("Product"),
        max_length=100,
        blank=True,
        null=True   
    )
    code = models.CharField(
        verbose_name=_("Code"),
        max_length=100,
        blank=True,
        null=True        
    )
    direct_entry = models.BooleanField(
        verbose_name=_("Direct Entry"),
        default=False,        
    )
    scada = models.BooleanField(
        verbose_name=_("SCADA"),
        default=True,        
    )


    def __str__(self):
        if self.status:
            return self.status
        elif self.product:
            return self.product
        elif self.code:
            return self.code
        elif self.direct_entry:
            return self.direct_entry
        elif self.scada:
            return self.scada

    class Meta:
        abstract = True
        ordering = ["name"]
        verbose_name = _("base_equip")
        verbose_name_plural = _("base_equips")
