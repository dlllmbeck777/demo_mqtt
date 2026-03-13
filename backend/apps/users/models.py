import uuid
import logging
from datetime import timedelta
from apps.layer.models import layer
from apps.roles.models import roles
from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.contrib.auth.models import Group
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


logger = logging.getLogger(__name__)


class UserManager(BaseUserManager):
    def _create_user(
        self,
        email,
        password,
        first_name,
        last_name,
        is_staff,
        is_superuser,
        **extra_fields,
    ):
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            last_name=last_name,
            is_staff=is_staff,
            is_active=True,
            is_superuser=is_superuser,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, email, first_name, last_name, password, **extra_fields):
        return self._create_user(
            email,
            password,
            first_name,
            last_name,
            is_staff=False,
            is_superuser=False,
            **extra_fields,
        )
        return user

    def create_superuser(
        self, email, first_name="", last_name="", password=None, **extra_fields
    ):
        return self._create_user(
            email,
            password,
            first_name,
            last_name,
            is_staff=True,
            is_superuser=True,
            is_admin=True,
            **extra_fields,
        )
        return user


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_("First Name"), max_length=50)
    last_name = models.CharField(_("Last Name"), max_length=50)
    email = models.EmailField(_("Email address"), unique=True)
    birth_year = models.CharField(_("Birth Year"), max_length=50, null=True)
    birth_month = models.CharField(_("Birth Month"), max_length=50, null=True)
    birth_day = models.CharField(_("Birth Day"), max_length=50, null=True)
    note = models.CharField(_("Note"), max_length=1000, null=True)
    twitter = models.CharField(_("Twitter"), max_length=500, null=True)
    facebook = models.CharField(_("Ingstagram"), max_length=500, null=True)
    linkedin = models.CharField(_("Linkedin"), max_length=500, null=True)
    phone_key = models.CharField(_("Phone Key"), max_length=50, null=True)
    phone_number = models.CharField(_("Phone Number"), max_length=50, null=True)
    designation = models.CharField(_("designation"), max_length=1000, null=True)
    country = models.CharField(_("Country"), max_length=50, null=True)
    state = models.CharField(_("State"), max_length=50, null=True)
    address_01 = models.CharField(_("Address 01"), max_length=500, null=True)
    address_02 = models.CharField(_("Address 02"), max_length=500, null=True)
    layer_name = models.ManyToManyField(layer, related_name="layerName", blank=True)
    active_layer = models.ForeignKey(
        layer, related_name="active_layer", on_delete=models.SET_NULL, null=True
    )
    role = models.ForeignKey(roles, on_delete=models.SET_NULL, null=True)
    is_staff = models.BooleanField(_("staff status"), default=False)
    is_superuser = models.BooleanField(_("superuser status"), default=False)
    is_active = models.BooleanField(_("active"), default=True)
    is_admin = models.BooleanField(_("admin"), default=False)
    is_client = models.BooleanField(_("client"), default=False)
    is_employee = models.BooleanField(_("employee"), default=False)
    first_login = models.BooleanField(default=False)
    service_admin = models.BooleanField(null=True, blank=True, default=False)
    date_joined = models.BigIntegerField(_("date joined"), default=4100803080000)
    date_updated = models.BigIntegerField(_("date updated"), default=4100803080000)

    forget_password_token = models.CharField(max_length=100, default="False")
    activation_key = models.UUIDField(unique=True, default=uuid.uuid4)  # email
    confirmed_email = models.BooleanField(default=False)
    # groups = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = UserManager()

    def __str__(self):
        # # if self.first_name and self.last_name:
        #     return f"{self.email} - {self.full_name}"
        # # else:
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} - {self.last_name}"

    def get_short_name(self):
        if self.first_name:
            return self.first_name
        else:
            return self.email

    def has_perm(self, perm, obj=None):
        return True

    def confirm_email(self):
        if not self.confirmed_email:
            self.confirmed_email = True
            self.save()
            return True
        return False

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        swappable = "AUTH_USER_MODEL"
