from django.db import models
from django.utils.translation import gettext_lazy as _


class Base_geo(models.Model):
    
    latitude = models.CharField(
        verbose_name=_("Latitude"),
        max_length=100,
        blank=True,
        null=True        
    )
    longitude = models.CharField(
        verbose_name=_("Longitude"),
        max_length=100,
        blank=True,
        null=True
    )
    country = models.CharField(
        verbose_name=_("Country"),
        max_length=100,
        blank=True,
        null=True
    )
    region = models.CharField(
        verbose_name=_("Region"),
        max_length=100, 
        blank=True, 
        null=True
    )
    subregion = models.CharField(
        verbose_name=_("Sub-Region"),
        max_length=100,
        blank=True,
        null=True
    )
    city = models.CharField(
        verbose_name=_("City"),
        max_length=100, 
        blank=True, 
        null=True
    )

    def __str__(self):
        if self.latitude:
            return self.latitude
        elif self.longitude:
            return self.longitude
        elif self.country:
            return self.country
        elif self.region:
            return self.region
        elif self.subregion:
            return self.subregion
        elif self.city:
            return self.city

    class Meta:
        abstract = True
        ordering = ["name"]
        verbose_name = _("base_geo")
        verbose_name_plural = _("base_geos")            