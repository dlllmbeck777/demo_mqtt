# Runtime Optimization Phases

## Phase 1

Быстрые оптимизации без ломки текущей схемы запуска:

- frontend polling выключен по умолчанию через `CHOKIDAR_USEPOLLING=false` и `WATCHPACK_POLLING=false`
- frontend install переведен на `npm ci`, когда есть `package-lock.json`
- из Django middleware убраны дублирующиеся `CommonMiddleware` и `UserRoleMiddleware`
- `pgadmin`, `mongo-express`, `control-center`, `kafdrop` переведены в профиль `ops`

Текущий запуск сохраняется:

```bash
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml up -d
docker compose --env-file docker-compose/.env -f docker-compose/db/docker-compose.yml up -d
docker compose --env-file docker-compose/.env -f docker-compose/data/docker-compose.yml up -d
```

Если нужны ops-сервисы:

```bash
docker compose --profile ops --env-file docker-compose/.env -f docker-compose/db/docker-compose.yml up -d pgadmin mongo-express
docker compose --profile ops --env-file docker-compose/.env -f docker-compose/data/docker-compose.yml up -d control-center kafdrop
```

## Phase 2

Правильный прод-путь запуска:

- Django image может собираться с `deploy.txt`
- Django по умолчанию запускается как ASGI через `daphne`
- добавлен отдельный production compose для фронта со статической сборкой:
  - `docker-compose/app/docker-compose.production.yml`
  - `all_dockerfiles/local/frontend-prod/Dockerfile`

Рекомендуемые env-параметры:

```env
DJANGO_REQUIREMENTS_FILE=deploy.txt
DJANGO_RUN_MODE=asgi
```

Прод-запуск app stack:

```bash
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.production.yml build
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.production.yml up -d
```

В таком режиме:

- `client` отдает собранный frontend как статические файлы
- `django` не использует `runserver`
- startup становится стабильнее и заметно легче по CPU/RAM
