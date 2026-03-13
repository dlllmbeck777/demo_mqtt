import json
import environ

env = environ.Env(DEBUG=(bool, False))
import redis
from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email
from django.db import transaction
import couchdb
from apps.resources_types.models import resources_types
from utils.service_config import (
    COUCHDB_DEFAULT_DATABASE,
    COUCHDB_PASSWORD,
    COUCHDB_URL,
    COUCHDB_USER,
)

rds = redis.StrictRedis(env("REDIS_HOST"), port=6379, db=0)


def validate_email(value):
    """Validate a single email."""
    if not value:
        return False
    # Check the regex, using the validate_email from django.
    try:
        django_validate_email(value)
        return True
    except ValidationError:
        return False


class AtomicMixin:
    """
    Ensure we rollback db transactions on exceptions.

    From https://gist.github.com/adamJLev/7e9499ba7e436535fd94
    """

    @transaction.atomic()
    def dispatch(self, *args, **kwargs):
        """Atomic transaction."""
        return super(AtomicMixin, self).dispatch(*args, **kwargs)

    def handle_exception(self, *args, **kwargs):
        """Handle exception with transaction rollback."""
        response = super(AtomicMixin, self).handle_exception(*args, **kwargs)

        if getattr(response, "exception"):
            # We've suppressed the exception but still need to
            # rollback any transaction.
            transaction.set_rollback(True)

        return response


class redisCaching:
    def set(cache_key, data):
        data = json.dumps(data)
        rds.set(cache_key, data)
        return True

    def get(cache_key):
        try:
            cache_data = rds.get(cache_key)
            if not cache_data:
                return None
            cache_data = cache_data.decode("utf-8")
            cache_data = json.loads(cache_data)
            return cache_data
        except:
            return None

    def delete(cache_key):
        rds.delete(cache_key)
        return True

    def lpush(cache_key, *args):
        rds.lpush(cache_key, *args)
        return True


def import_data(model="model", model_name="model_name", is_relationship=False):
    with transaction.atomic():
        try:
            server = couchdb.Server(COUCHDB_URL)
            server.resource.credentials = (COUCHDB_USER, COUCHDB_PASSWORD)
            db = server[COUCHDB_DEFAULT_DATABASE]
            data = db.get(model_name).get("values")
            chunked_data = [data[i : i + 1000] for i in range(0, len(data), 1000)]
            if is_relationship:
                for chunk in chunked_data:
                    model.objects.bulk_create(chunk)
            else:
                for chunk in chunked_data:
                    model.objects.bulk_create([model(**item) for item in chunk])
            return True
        except Exception as e:
            print(str(e))
            transaction.set_rollback(True)
            return {"error": str(e)}


def tag_import_mandorty(columns):
    mandatory = ["START_DATETIME", "EVENT_TYPE", "NAME", "PERIOD"]
    response = []

    for item in mandatory:
        if not (item in columns):
            # print(item)
            response.append(item)

    if len(response) >= 1:
        raise ValidationError(
            {"Message": "fields = " + str(response) + " is missing in the loaded file"}
        )


def get_http_message(http_code):
    obj = (
        resources_types.objects.filter(ID=f"TYPE.HTTP_CODE.{http_code}")
        .values("ID")
        .first()
    )
    return obj.get("ID")


def get_info_message(id, culture="en-US"):
    obj = (
        resources_types.objects.filter(ID=f"TYPE.REACT.{id}", CULTURE=culture)
        .values("SHORT_LABEL", "MOBILE_LABEL")
        .first()
    )
    return obj


# def get_health_status_messages(status_type, culture):  # status_type = UP or DOWN
#     obj = (
#         resources_types.objects.filter(
#             ID=f"TYPE.HEALTH_STATUS.{status_type}", CULTURE=culture
#         )
#         .values("SHORT_LABEL")
#         .first()
#     )
#     return obj.get("SHORT_LABEL")


# def get_warning_messages(is_retrieval, culture):  # data retrieval
#     label_id = ""
#     if is_retrieval:
#         label_id = "INFO"
#     else:
#         label_id = "FAILED"
#     obj = (
#         resources_types.objects.filter(
#             ID=f"TYPE.WARNINGS.DATA.RETRIEVAL.{label_id}",
#             CULTURE=culture,
#         )
#         .values("SHORT_LABEL")
#         .first()
#     )
#     return obj.get("SHORT_LABEL")
