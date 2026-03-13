from django.contrib import admin
from operator import or_
from ..models import Company
from ..translation import *
from modeltranslation.admin import TabbedTranslationAdmin
from django.utils.translation import gettext_lazy as _


class CompanyAdminBase(TabbedTranslationAdmin):
    group_fieldsets = True


admin.site.register(Company, CompanyAdminBase)
