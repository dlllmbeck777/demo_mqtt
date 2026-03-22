import os


def _get_env(name, default=None):
    value = os.environ.get(name)
    if value in (None, ""):
        return default
    return value


def _slug(value, fallback):
    value = str(value or fallback).strip().lower()
    return value or fallback


DEFAULT_LAYER_NAME = _slug(
    _get_env(
        "REACT_APP_LAYER_NAME",
        _get_env("DIAGNOSTIC_LAYER_NAME", _get_env("COMPANY_NAME", "STD")),
    ),
    "std",
)

DEFAULT_BACKEND_API_BASE_URL = _get_env("DEFAULT_BACKEND_API_BASE_URL", "http://localhost:8000")
BACKEND_API_BASE_URL = _get_env("APP_API_BASE_URL", DEFAULT_BACKEND_API_BASE_URL)

DEFAULT_MONGO_URL = "mongodb://admin:admin@mongo-dev:27017/"
MONGO_URL = _get_env("Mongo_Client", DEFAULT_MONGO_URL)
os.environ.setdefault("Mongo_Client", MONGO_URL)

DEFAULT_CELERY_URL = "redis://redis:6379/1"
CELERY_BROKER_URL = _get_env("CELERY_BROKER", _get_env("BROKER_URL", DEFAULT_CELERY_URL))
CELERY_RESULT_BACKEND = _get_env(
    "CELERY_BACKEND",
    _get_env("CELERY_RESULT_BACKEND", CELERY_BROKER_URL),
)

INFLUX_URL = _get_env("INFLUX_HOST", "http://influxdb1:8086")
INFLUX_TOKEN = _get_env(
    "INFLUX_DB_TOKEN",
    "CHANGE_ME_IN_ENV",
)
INFLUX_ORG = _get_env("INFLUX_ORG", "nordal")
INFLUX_LIVE_BUCKET = _get_env("INFLUX_LIVE_BUCKET", f"{DEFAULT_LAYER_NAME}_live")
INFLUX_BACKFILL_BUCKET = _get_env(
    "INFLUX_BACKFILL_BUCKET",
    f"{DEFAULT_LAYER_NAME}_backfill",
)
INFLUX_BACKFILL_ALARM_BUCKET = _get_env(
    "INFLUX_BACKFILL_ALARM_BUCKET",
    f"{DEFAULT_LAYER_NAME}_backfill_alarms",
)
INFLUX_BACKFILL_LOGS_BUCKET = _get_env(
    "INFLUX_BACKFILL_LOGS_BUCKET",
    f"{DEFAULT_LAYER_NAME}_backfill_logs",
)
INFLUX_ALARMS_BUCKET = _get_env("INFLUX_ALARMS_BUCKET", f"{DEFAULT_LAYER_NAME}_alarms")
INFLUX_NOTIFICATIONS_BUCKET = _get_env(
    "INFLUX_NOTIFICATIONS_BUCKET",
    f"{DEFAULT_LAYER_NAME}_notifications",
)
INFLUX_LOGS_BUCKET = _get_env("INFLUX_LOGS_BUCKET", f"{DEFAULT_LAYER_NAME}_logs")
INFLUX_ANOMALY_BUCKET = _get_env("INFLUX_ANOMALY_BUCKET", INFLUX_LIVE_BUCKET)

COUCHDB_USER = _get_env("COUCHDB_USER", "COUCHDB_USER")
COUCHDB_PASSWORD = _get_env("COUCHDB_PASSWORD", "COUCHDB_PASSWORD")
COUCHDB_HOST = _get_env("COUCHDB_HOST", "couchserver")
COUCHDB_PORT = _get_env("COUCHDB_PORT", "5984")
COUCHDB_URL = _get_env(
    "COUCHDB_URL",
    f"http://{COUCHDB_USER}:{COUCHDB_PASSWORD}@{COUCHDB_HOST}:{COUCHDB_PORT}/",
)
COUCHDB_DEFAULT_DATABASE = _get_env("COUCHDB_DATABASE", "demo")
