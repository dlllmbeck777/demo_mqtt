from modeltranslation.translator import register, TranslationOptions
from .models import (
    Base_domain,
    Base_equip,
    Base_geo,
    Battery,
    Company,
    Field,
    Completion,
    Pump,
)


@register(Base_domain)
class BaseTranslationOptions(TranslationOptions):
    fields = (
        "name",
        "short_name",
    )


@register(Base_equip)
class BaseEquipTranslationOptions(TranslationOptions):
    fields = (
        "status",
        "product",
    )


@register(Base_geo)
class BaseEquipTranslationOptions(TranslationOptions):
    fields = (
        "country",
        "region",
        "subregion",
        "city",
    )


@register(Battery)
class BatteryTranslationOptions(TranslationOptions):
    fields = ("battery_type",)


@register(Company)
class CompanyTranslationOptions(TranslationOptions):
    fields = (
        "contact_name",
        "address",
    )


@register(Field)
class FieldTranslationOptions(TranslationOptions):
    pass


@register(Completion)
class CompletionTranslationOptions(TranslationOptions):
    fields = (
        "comp_type",
        "disp_type",
        "inv_method",
        "lift_type",
        "recovery",
        "cond_theor_m",
        "gas_theor_m",
        "oil_theor_m",
        "water_theor_m",
        "reservoir_phase",
        "reservoir_type",
    )


@register(Pump)
class PumpTranslationOptions(TranslationOptions):
    pass
