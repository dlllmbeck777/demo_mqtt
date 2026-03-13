from django.contrib import admin
from ..translation import *
from ..models import Completion
from modeltranslation.admin import TranslationAdmin
from django.utils.translation import gettext_lazy as _


class CompletionAdminBase(TranslationAdmin):
    group_fieldsets = True


admin.site.register(Completion, CompletionAdminBase)
