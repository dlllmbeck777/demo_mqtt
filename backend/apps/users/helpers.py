import secrets
from django.core.mail import send_mail
import string
import random
from django.conf import settings


def send_forget_password_mail(email="", token="", message="", subject=""):
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)
    return True


import secrets
import string


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
