# Diagnostics services

This stack adds four runtime services for Diagnostics:

- `diagnostic-probes`
- `diagnostic-notifications-consumer`
- `diagnostic-warnings-consumer`
- `diagnostic-logs-consumer`

## What they do

`diagnostic-probes`
- runs periodic health checks
- publishes `notifications` and `warnings` to Kafka

`diagnostic-notifications-consumer`
- consumes Kafka topic `notifications`
- writes current state to Mongo `notifications`
- writes history to PostgreSQL `event_event`

`diagnostic-warnings-consumer`
- consumes Kafka topic `warnings`
- writes current state to Mongo `warnings`
- writes history to PostgreSQL `event_event`

`diagnostic-logs-consumer`
- consumes Kafka topic `logs`
- writes runtime docs to Mongo `logs`
- writes history to PostgreSQL `logs_logs`

## Required env

Set these in `docker-compose/.env`:

```env
DIAGNOSTIC_LAYER_NAME=horasan
DIAGNOSTIC_DJANGO_HEALTH_URL=http://django:8000/api/v1/health/
DIAGNOSTIC_PROBE_INTERVAL_SECONDS=60
Kafka_Host_DP=broker:29092
Mongo_Client=mongodb://admin:admin@mongo-dev:27017/
```

## Start

```bash
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml up -d --build diagnostic-probes diagnostic-notifications-consumer diagnostic-warnings-consumer diagnostic-logs-consumer
```

## Check

```bash
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml logs --tail=100 diagnostic-probes
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml logs --tail=100 diagnostic-notifications-consumer
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml logs --tail=100 diagnostic-warnings-consumer
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml logs --tail=100 diagnostic-logs-consumer
```
