from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings
from utils.service_config import CELERY_BROKER_URL, CELERY_RESULT_BACKEND

if os.environ.get("DJANGO_SETTINGS_MODULE", None) is None:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.dev")

app = Celery("core", backend=CELERY_RESULT_BACKEND, broker=CELERY_BROKER_URL)
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@app.task(bind=True)
def debug_task(self):
    print("Request: {0!r}".format(self.request))


# @app.task(bind=True)
# def debug_task_with_request(self):
#     print("Request: {0!r}".format(self.request))


# @app.task(bind=True)
# def debug_task(self):
#     print(f"Request: {self.request!r}")


# @app.task(bind=True)
# def debug_task_from_shell(self):
#     print("debug_task_from_shell executed")
