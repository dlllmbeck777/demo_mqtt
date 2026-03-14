# Runtime retention

This project stores runtime data in several places:
- Docker container logs
- Kafka topics
- Mongo runtime collections
- PostgreSQL `logs_logs`
- Influx buckets

This repo now limits the first four by default.

## What is enforced now

Docker logs:
- rotated with `json-file`
- `DOCKER_LOG_MAX_SIZE=10m`
- `DOCKER_LOG_MAX_FILE=5`

Kafka broker:
- topic retention time default `168` hours
- topic retention size default `1073741824` bytes
- segment size default `268435456` bytes

Mongo runtime collections:
- `notifications` default `14` days
- `logs` default `30` days
- `warnings` default `30` days
- `alarms` default `90` days

PostgreSQL:
- `logs_logs` default `30` days

## How pruning works

The app stack now includes `housekeeping`.

It runs:
- [scripts/prune-runtime-data.py](D:/ligeaai_backup_2025-05-11/ligeia.ai/scripts/prune-runtime-data.py)

It:
- deletes old rows from `logs_logs`
- deletes old runtime docs from Mongo by `time`
- creates a `time` index on those Mongo collections if missing

Default interval:
- every `21600` seconds
- that is every `6` hours

## Config vars

Set these in `docker-compose/.env` if you want other limits:

```env
DOCKER_LOG_MAX_SIZE=10m
DOCKER_LOG_MAX_FILE=5
PRUNE_INTERVAL_SECONDS=21600
PG_LOG_RETENTION_DAYS=30
MONGO_LOG_RETENTION_DAYS=30
MONGO_WARNING_RETENTION_DAYS=30
MONGO_NOTIFICATION_RETENTION_DAYS=14
MONGO_ALARM_RETENTION_DAYS=90
KAFKA_LOG_RETENTION_HOURS=168
KAFKA_LOG_RETENTION_BYTES=1073741824
KAFKA_LOG_SEGMENT_BYTES=268435456
```

## Apply on server

Rebuild app and data stacks:

```bash
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml up -d --build
docker compose --env-file docker-compose/.env -f docker-compose/data/docker-compose.yml up -d
```

Check:

```bash
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml logs --tail=100 housekeeping
```

## Important limitation

Influx retention is still not enforced automatically by this repo.

Current compose starts InfluxDB, but bucket retention for:
- live bucket
- backfill bucket
- alarm/log buckets

still needs a dedicated init or update step.

That should be the next step if you want a full hard cap on disk growth.
