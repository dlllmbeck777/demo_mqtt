from django.contrib import admin
from django.apps import apps
from modeltranslation.admin import TranslationAdmin
# from dbmodels.models._base_domain import Base_domain
# from core.models._base_domain import Do
from modeltranslation.admin import TranslationTabularInline

# admin.site.register()

models = apps.get_models()

# class BaseDomainInline(TranslationTabularInline):
#     model = Base_domain

# class BaseDomainAdmin(TranslationAdmin):
#     pass

# admin.site.register(Base_domain, BaseDomainAdmin)

for model in models:
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        pass

# admin.site.register(Base_domain)



