# mysite/main/tasks.py

from __future__ import absolute_import
from celery import shared_task
from .helpers import create_database, updateDB, deleteDB


@shared_task
def async_create_database(database_settings):
    create_database(database_settings, **database_settings["DB_SETTINGS"])


@shared_task
def async_update_database(layers, validated_data):
    updateDB(
        layers,
        validated_data,
    )


@shared_task
def async_delete_database(layer_name, db_settings):
    deleteDB(layer_name, db_settings)
