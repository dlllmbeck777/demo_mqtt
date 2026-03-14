import os


def _get_env(name, default=None):
    value = os.environ.get(name)
    if value in (None, ""):
        return default
    return value


DEFAULT_BACKEND_API_BASE_URL = "http://192.168.1.88:8000"
BACKEND_API_BASE_URL = _get_env("APP_API_BASE_URL", DEFAULT_BACKEND_API_BASE_URL)

DEFAULT_MONGO_URL = "mongodb://root:admin@mongodb-timescale:27017/"
MONGO_URL = _get_env("Mongo_Client", DEFAULT_MONGO_URL)
os.environ.setdefault("Mongo_Client", MONGO_URL)

DEFAULT_CELERY_URL = "redis://192.168.1.88:6379"
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
INFLUX_LIVE_BUCKET = _get_env("INFLUX_LIVE_BUCKET", "horasan_live")
INFLUX_BACKFILL_BUCKET = _get_env("INFLUX_BACKFILL_BUCKET", "horasan_backfill")
INFLUX_BACKFILL_ALARM_BUCKET = _get_env(
    "INFLUX_BACKFILL_ALARM_BUCKET",
    "inkai_backfill_alarms",
)
INFLUX_BACKFILL_LOGS_BUCKET = _get_env(
    "INFLUX_BACKFILL_LOGS_BUCKET",
    "inkai_backfill_logs",
)

COUCHDB_USER = _get_env("COUCHDB_USER", "COUCHDB_USER")
COUCHDB_PASSWORD = _get_env("COUCHDB_PASSWORD", "COUCHDB_PASSWORD")
COUCHDB_HOST = _get_env("COUCHDB_HOST", "192.168.1.88")
COUCHDB_PORT = _get_env("COUCHDB_PORT", "5984")
COUCHDB_URL = _get_env(
    "COUCHDB_URL",
    f"http://{COUCHDB_USER}:{COUCHDB_PASSWORD}@{COUCHDB_HOST}:{COUCHDB_PORT}/",
)
COUCHDB_DEFAULT_DATABASE = _get_env("COUCHDB_DATABASE", "demo")
