# mysite/main/tasks.py

from __future__ import absolute_import
from celery import shared_task


@shared_task
def test(param):
    veri = f"The tasks executed with the following parameter: {param}"
    return veri
