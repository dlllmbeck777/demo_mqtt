from django.db import models
from django.utils.translation import gettext_lazy as _
from .model_base_equip import Base_equip
from .model_base_geo import Base_geo


class Company(Base_equip, Base_geo):

    company_ref = models.ManyToManyField(
        "self", 
        blank=True, 
        symmetrical=False, 
        verbose_name=_("Parent Company")
    )
    contact_name = models.CharField(
        verbose_name=_("Contact Name"),
        max_length=100,
        blank=True,
        null=True
    )
    address = models.CharField(
        verbose_name=_("Address"),
        max_length=100,
        blank=True,
        null=True
    )
    email = models.EmailField(
        verbose_name=_("e-mail"),
        max_length=100, 
        blank=True, 
        null=True
    )
    phone = models.CharField(
        verbose_name=_("Phone"),
        max_length=100, 
        blank=True, 
        null=True    
    )
    operator = models.BooleanField(
        verbose_name=_("Operator"),
        blank=True, 
        default=True
    )
    owner = models.BooleanField(
        verbose_name=_("Owner"),
        blank=True, 
        default=True
    )
    purchaser = models.BooleanField(
        verbose_name=_("Purchaser"),
        blank=True, 
        default=True
    )
    transporter = models.BooleanField(
        verbose_name=_("Transporter"),
        blank=True, 
        default=True
    )
    service_provider = models.BooleanField(
        verbose_name=_("Service Provider"), 
        blank=True, 
        default=False
    )

    def __str__(self):
        if self.contact_name:
            return self.contact_name
        elif self.address:
            return self.address
        elif self.email:
            return self.email
        elif self.phone:
            return self.phone
        elif self.operator:
            return self.operator
        elif self.owner:
            return self.owner
        elif self.purchaser:
            return self.purchaser
        elif self.transporter:
            return self.transporter
        elif self.service_provider:
            return self.service_provider

    def get_company_ref(self):
        return ",".join([str(p) for p in self.company_ref.all()])

    class Meta:
        ordering = ["name"]
        verbose_name = _("company")
        verbose_name_plural = _("companies")
