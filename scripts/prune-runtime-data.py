import os
import sys
import time
from typing import Iterable, List, Set, Tuple

import psycopg2
from pymongo import DESCENDING, MongoClient


SYSTEM_MONGO_DATABASES = {"admin", "config", "local"}


def env_int(name: str, default: int) -> int:
    value = os.environ.get(name)
    if value is None or value == "":
        return default
    try:
        return int(value)
    except ValueError:
        return default


def now_ms() -> int:
    return int(time.time() * 1000)


def cutoff_ms(days: int) -> int:
    return now_ms() - days * 24 * 60 * 60 * 1000


def pg_connection(dbname: str):
    return psycopg2.connect(
        host=os.environ.get("PG_HOST", "postgres"),
        port=os.environ.get("PG_PORT", "5432"),
        user=os.environ.get("PG_USER", "postgres"),
        password=os.environ.get("PG_PASS", "postgres"),
        dbname=dbname,
    )


def get_pg_target_dbs() -> List[str]:
    configured = {
        os.environ.get("PG_DB", "").strip(),
        "demo",
        "horasan",
    }
    configured = {name for name in configured if name}

    try:
        with pg_connection("postgres") as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT datname
                    FROM pg_database
                    WHERE datistemplate = false
                      AND datallowconn = true
                    """
                )
                existing = {row[0] for row in cur.fetchall()}
    except Exception as exc:
        print(f"[prune] postgres discovery failed: {exc}", file=sys.stderr)
        return sorted(configured)

    return sorted(configured & existing)


def prune_postgres_logs() -> None:
    retention_days = env_int("PG_LOG_RETENTION_DAYS", 30)
    threshold = cutoff_ms(retention_days)

    for db_name in get_pg_target_dbs():
        try:
            with pg_connection(db_name) as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT to_regclass('public.logs_logs')")
                    if cur.fetchone()[0] is None:
                        print(f"[prune][pg:{db_name}] logs_logs not found, skip")
                        continue

                    cur.execute("DELETE FROM public.logs_logs WHERE time < %s", (threshold,))
                    deleted = cur.rowcount
                conn.commit()
            print(
                f"[prune][pg:{db_name}] deleted {deleted} rows older than {retention_days} days"
            )
        except Exception as exc:
            print(f"[prune][pg:{db_name}] failed: {exc}", file=sys.stderr)


def mongo_retention_plan() -> List[Tuple[str, int]]:
    return [
        (os.environ.get("Mongo_Notifications_db", "notifications"), env_int("MONGO_NOTIFICATION_RETENTION_DAYS", 14)),
        (os.environ.get("Mongo_Logs_db", "logs"), env_int("MONGO_LOG_RETENTION_DAYS", 30)),
        (os.environ.get("Mongo_Warnings_db", "warnings"), env_int("MONGO_WARNING_RETENTION_DAYS", 30)),
        (os.environ.get("Mongo_Alarms_db", "alarms"), env_int("MONGO_ALARM_RETENTION_DAYS", 90)),
    ]


def iter_runtime_mongo_db_names(client: MongoClient, collection_names: Iterable[str]) -> Set[str]:
    db_names = {
        name
        for name in client.list_database_names()
        if name not in SYSTEM_MONGO_DATABASES and not name.startswith("_")
    }

    # Legacy layout sometimes used db==collection, keep it in the prune set too.
    db_names.update(collection_names)
    return db_names


def prune_mongo_runtime() -> None:
    mongo_url = os.environ.get("Mongo_Client")
    if not mongo_url:
        print("[prune][mongo] Mongo_Client not set, skip")
        return

    plan = mongo_retention_plan()
    collection_names = [name for name, _ in plan]

    try:
        client = MongoClient(mongo_url)
    except Exception as exc:
        print(f"[prune][mongo] connect failed: {exc}", file=sys.stderr)
        return

    try:
        for db_name in sorted(iter_runtime_mongo_db_names(client, collection_names)):
            db = client[db_name]
            existing = set(db.list_collection_names())

            for collection_name, retention_days in plan:
                if collection_name not in existing:
                    continue

                collection = db[collection_name]
                threshold = cutoff_ms(retention_days)

                try:
                    collection.create_index([("time", DESCENDING)])
                except Exception as exc:
                    print(
                        f"[prune][mongo:{db_name}.{collection_name}] index creation failed: {exc}",
                        file=sys.stderr,
                    )

                try:
                    result = collection.delete_many({"time": {"$lt": threshold}})
                    print(
                        f"[prune][mongo:{db_name}.{collection_name}] deleted {result.deleted_count} docs older than {retention_days} days"
                    )
                except Exception as exc:
                    print(
                        f"[prune][mongo:{db_name}.{collection_name}] failed: {exc}",
                        file=sys.stderr,
                    )
    finally:
        client.close()


if __name__ == "__main__":
    prune_postgres_logs()
    prune_mongo_runtime()
