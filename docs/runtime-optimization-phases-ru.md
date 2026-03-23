# Runtime Optimization Phases

## Phase 1

Быстрые улучшения без ломки рабочего Inkai pipeline:

- frontend polling по умолчанию выключен
- frontend install использует `npm ci`, когда доступен `package-lock.json`
- дубли middleware в Django убраны
- ops-сервисы вынесены в отдельные профили
- diagnostics можно запускать одним сервисом `diagnostic-runtime`
- `rabbitmq` и `connect` больше не входят в default startup data-stack

Текущий рекомендуемый запуск:

```bash
docker compose --env-file docker-compose/.env -f docker-compose/db/docker-compose.yml up -d
docker compose --env-file docker-compose/.env -f docker-compose/data/docker-compose.yml up -d
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.production.yml up -d
```

Если нужны ops-сервисы:

```bash
docker compose --profile ops --env-file docker-compose/.env -f docker-compose/db/docker-compose.yml up -d pgadmin mongo-express
docker compose --profile ops --env-file docker-compose/.env -f docker-compose/data/docker-compose.yml up -d control-center kafdrop rabbitmq connect
```

Если нужны старые split diagnostics containers:

```bash
docker compose --profile legacy-diagnostics --env-file docker-compose/.env -f docker-compose/app/docker-compose.production.yml up -d diagnostic-probes diagnostic-notifications-consumer diagnostic-warnings-consumer diagnostic-logs-consumer
```

## Phase 2

Правильный production app path:

- bootstrap и historical scripts по умолчанию используют `docker-compose/app/docker-compose.production.yml`
- production `client` собирается как статический frontend и отдаётся через nginx
- production Django контейнеры больше не зависят от bind mount исходников
- Django image собирается с кодом проекта внутри контейнера
- diagnostics, housekeeping и django используют один и тот же собранный image

Рекомендуемые env-параметры:

```env
DJANGO_REQUIREMENTS_FILE=deploy.txt
DJANGO_RUN_MODE=asgi
DIAGNOSTIC_ENABLE_RABBITMQ_PROBE=false
```

Production app stack:

```bash
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.production.yml build
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.production.yml up -d
```

В таком режиме:

- `client` отдаёт собранный frontend как статику
- `django` запускается через `daphne`, а не через `runserver`
- startup становится стабильнее и легче по CPU/RAM
- default runtime не тянет лишние сервисы без явного запроса
