import subprocess
from django.db import connection, connections
from django.db.utils import ProgrammingError
import environ
import couchdb
import importlib
from utils.utils import import_data
import subprocess
import os
from django.core.management import call_command
from django.conf import settings
from django.db import DEFAULT_DB_ALIAS
from django.db import connection, connections
from .models import layer
from django import db
from utils.service_config import (
    COUCHDB_DEFAULT_DATABASE,
    COUCHDB_PASSWORD,
    COUCHDB_URL,
    COUCHDB_USER,
)

env = environ.Env(DEBUG=(bool, False))


def getDefaultDBSettings():
    return settings.DATABASES["default"].copy()


def to_layerDb(layers):
    try:
        change_db("default")
        user_db_settings = getDefaultDBSettings()
        active_db_settings = (
            layer.objects.filter(LAYER_NAME=layers).values("DB_SETTINGS").first()
        )
        # print(active_db_settings)
        user_db_settings.update(active_db_settings.get("DB_SETTINGS"))

        user_db_settings["NAME"] = user_db_settings["NAME"].lower()

        settings.DATABASES["layer_db"] = user_db_settings

        connections["layer_db"].settings_dict = settings.DATABASES["layer_db"]

        change_db("layer_db")

    except Exception as e:
        print(e)
        print("----------->", str(e))


def change_db(db_type):
    # print(connections.all())
  
    for connection in connections.all():

            connection.close()
   
    connections[DEFAULT_DB_ALIAS] = connections[db_type]

    


def create_database(data, **kwargs):
    user_db_settings = settings.DATABASES["default"].copy()
    kwargs["NAME"] = kwargs["NAME"].lower()
    user_db_settings.update(kwargs)

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "CREATE DATABASE {} WITH OWNER = {} ENCODING = 'UTF8'".format(
                    user_db_settings["NAME"], user_db_settings["USER"]
                )
            )
    except ProgrammingError as e:
        return str(e)

    settings.DATABASES["layer_db"] = user_db_settings

    # Update the connections information for the default database
    connections["layer_db"].settings_dict = settings.DATABASES["layer_db"]

    change_db("layer_db")
    try:
        call_command("migrate")
        get_data()
        new_layer = layer.objects.create(**data)
        change_db("layer_db")
    except Exception as e:
        print(f"Error: {e}")

    return "Database created successfully"


def get_data():
    server = couchdb.Server(COUCHDB_URL)
    server.resource.credentials = (COUCHDB_USER, COUCHDB_PASSWORD)
    db = server[COUCHDB_DEFAULT_DATABASE]
    rows = db.view("_all_docs", include_docs=True)
    document_names = [row["id"] for row in rows]
    # print(document_names)
    for documents in document_names:
        module = importlib.import_module(f"apps.{documents}.models")
        obj = getattr(module, documents)
        if documents == "roles":
            import_data(obj, documents, is_relationship=True)
        else:
            import_data(obj, documents)


def updateDB(old_db_name, new_db_name):
    try:
        change_db("default")
        alter_db_query = (
            f"ALTER DATABASE {old_db_name.lower()} RENAME TO {new_db_name.lower()}"
        )
        # Veritabanı adını güncelle
        with connection.cursor() as cursor:
            cursor.execute(alter_db_query)

    except Exception as e:
        print(str(e))
        # raise ProgrammingError("error")


def deleteDB(layer_name, db_settings):
    try:
        # backupDB(layer_name, db_settings)
        drop_command = f"DROP DATABASE {db_settings.get('NAME')}"
        db.connections.close_all()
        with connections["default"].cursor() as cursor:
            cursor.execute(drop_command)
    except ProgrammingError as e:
        return str(e)


def backupDB(layer_name, db_settings):
    try:
        to_layerDb(layer_name)
        backup_file = f"backup/{db_settings.get('NAME').lower()}.sql"
        backup_command = [
            "pg_dump",
            "-h",
            db_settings["HOST"],
            "-p",
            str(db_settings["PORT"]),
            "-U",
            db_settings["USER"],
            "-W",
            "-d",
            db_settings["NAME"],
            "-f",
            backup_file,
        ]

        env = {**os.environ, "PGPASSWORD": db_settings["PASSWORD"]}
        subprocess.run(backup_command, env=env)
    except Exception as e:
        print(str(e))
