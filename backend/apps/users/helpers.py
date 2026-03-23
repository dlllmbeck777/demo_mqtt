import secrets
import string

from django.conf import settings
from django.core.mail import send_mail

from apps.layer.models import layer


PUBLIC_DEFAULT_LAYER = "Inkai"
INTERNAL_LAYERS = {"STD"}


def send_forget_password_mail(email="", token="", message="", subject=""):
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)
    return True

def generate_random_password(length=12):
    alphabet = string.ascii_letters + string.digits + ",+!"
    while True:
        password = "".join(secrets.choice(alphabet) for _ in range(length))
        if (
            any(c.islower() for c in password)
            and any(c.isupper() for c in password)
            and sum(c.isdigit() for c in password) >= 2
            and any(c in ",+!" for c in password)
        ):
            return password


def is_admin_user(user):
    if not user:
        return False

    role_name = getattr(getattr(user, "role", None), "ROLES_NAME", "")
    return bool(
        getattr(user, "is_superuser", False)
        or getattr(user, "is_admin", False)
        or role_name == "Admin"
    )


def sort_layer_names(layer_names):
    unique_names = list(dict.fromkeys(layer_names or []))

    def sort_key(name):
        if name == PUBLIC_DEFAULT_LAYER:
            return (0, name.lower())
        if name in INTERNAL_LAYERS:
            return (2, name.lower())
        return (1, name.lower())

    return sorted(unique_names, key=sort_key)


def ensure_public_layer_membership(user, alias):
    if not user or is_admin_user(user):
        return user

    layer_names = list(user.layer_name.values_list("LAYER_NAME", flat=True))
    public_layers = [name for name in layer_names if name not in INTERNAL_LAYERS]
    preferred_layer = layer.objects.using(alias).filter(
        LAYER_NAME=PUBLIC_DEFAULT_LAYER
    ).first()
    changed = False

    if not public_layers and preferred_layer:
        user.layer_name.add(preferred_layer)
        public_layers = [preferred_layer.LAYER_NAME]
        changed = True

    current_active_layer = getattr(user.active_layer, "LAYER_NAME", None)
    target_active_layer_name = current_active_layer

    if current_active_layer in INTERNAL_LAYERS or not current_active_layer:
        if preferred_layer and preferred_layer.LAYER_NAME in public_layers:
            target_active_layer_name = preferred_layer.LAYER_NAME
        elif public_layers:
            target_active_layer_name = sort_layer_names(public_layers)[0]

    if target_active_layer_name and current_active_layer != target_active_layer_name:
        next_active_layer = layer.objects.using(alias).filter(
            LAYER_NAME=target_active_layer_name
        ).first()
        if next_active_layer:
            user.active_layer = next_active_layer
            changed = True

    if changed:
        user.save(using=alias)

    return user


def visible_layer_names(user, alias):
    if not user:
        return []

    user = ensure_public_layer_membership(user, alias)
    layer_names = list(user.layer_name.values_list("LAYER_NAME", flat=True))

    if is_admin_user(user):
        return sort_layer_names(layer_names)

    public_layers = [name for name in layer_names if name not in INTERNAL_LAYERS]
    if public_layers:
        return sort_layer_names(public_layers)
    return sort_layer_names(layer_names)


def public_active_layer_name(user, alias):
    if not user:
        return PUBLIC_DEFAULT_LAYER

    user = ensure_public_layer_membership(user, alias)
    active_layer_name = getattr(user.active_layer, "LAYER_NAME", None)
    visible_layers = visible_layer_names(user, alias)

    if active_layer_name in visible_layers:
        return active_layer_name
    if visible_layers:
        return visible_layers[0]
    return active_layer_name or PUBLIC_DEFAULT_LAYER
