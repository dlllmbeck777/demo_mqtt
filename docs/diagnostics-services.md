# Diagnostics services

Default runtime now uses one service:

- `diagnostic-runtime`

Legacy split runtime is still available behind the compose profile `legacy-diagnostics`:

- `diagnostic-probes`
- `diagnostic-notifications-consumer`
- `diagnostic-warnings-consumer`
- `diagnostic-logs-consumer`

## What they do

`diagnostic-runtime`
- runs periodic health checks
- consumes Kafka topics `notifications`, `warnings`, `logs`
- writes current state to Mongo runtime collections
- writes history to PostgreSQL event/log tables

Legacy split services keep the old one-process-per-role model.

## Required env

Set these in `docker-compose/.env`:

```env
DIAGNOSTIC_LAYER_NAME=Inkai
DIAGNOSTIC_DJANGO_HEALTH_URL=http://django:8000/api/v1/health/
DIAGNOSTIC_PROBE_INTERVAL_SECONDS=60
DIAGNOSTIC_ENABLE_RABBITMQ_PROBE=false
Kafka_Host_DP=broker:29092
Mongo_Client=mongodb://admin:admin@mongo-dev:27017/
```

## Start

```bash
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.production.yml up -d --build diagnostic-runtime
```

## Check

```bash
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.production.yml logs --tail=100 diagnostic-runtime
```

## Legacy split mode

```bash
docker compose --profile legacy-diagnostics --env-file docker-compose/.env -f docker-compose/app/docker-compose.production.yml up -d diagnostic-probes diagnostic-notifications-consumer diagnostic-warnings-consumer diagnostic-logs-consumer
```
