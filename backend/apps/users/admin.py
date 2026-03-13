from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _


from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import User


class UserAdmin(UserAdmin):
    form = CustomUserCreationForm
    add_form = CustomUserChangeForm
    model = User

    list_display = (
        "email",
        "first_name",
        "last_name",
    )
    list_filter = ("is_admin",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            _("Personal info"),
            {
                "fields": (
                    "first_name",
                    "last_name",
                )
            },
        ),
        (
            _("Permissions and Groups"),
            {
                "fields": (
                    "is_superuser",
                    "is_active",
                    "is_admin",
                    "is_staff",
                    "is_employee",
                    "is_client",
                    "service_admin",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                ),
            },
        ),
    )

    search_fields = ("email",)
    ordering = ("email",)
    filter_horizontal = ()


admin.site.register(User, UserAdmin)
