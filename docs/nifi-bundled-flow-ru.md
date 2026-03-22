# Bundled NiFi flow при деплое

В репо добавлена автоматическая загрузка готового NiFi flow в image.

Что это значит:

- `flow.xml.gz` и `flow.json.gz` лежат в git
- при сборке `nifi` image они попадают внутрь контейнера
- при старте контейнера специальный bootstrap-скрипт копирует их в NiFi `conf`
- ручной импорт flow через UI больше не нужен для стандартного деплоя

Файлы:

- [Dockerfile](d:/ligeaai_backup_2025-05-11/ligeia.ai/all_dockerfiles/local/datapipline/Nifi/Dockerfile)
- [nifi-entrypoint-with-flow.sh](d:/ligeaai_backup_2025-05-11/ligeia.ai/all_dockerfiles/local/datapipline/Nifi/nifi-entrypoint-with-flow.sh)
- [flow.xml.gz](d:/ligeaai_backup_2025-05-11/ligeia.ai/all_dockerfiles/local/datapipline/Nifi/bootstrap-flow/flow.xml.gz)
- [flow.json.gz](d:/ligeaai_backup_2025-05-11/ligeia.ai/all_dockerfiles/local/datapipline/Nifi/bootstrap-flow/flow.json.gz)

## Как это работает

При старте `nifi` контейнера скрипт смотрит переменную:

```env
NIFI_BUNDLED_FLOW_MODE=replace
```

Поддерживаются режимы:

- `replace`
  всегда заменяет `conf/flow.json.gz` и `conf/flow.xml.gz` на версии из git
- `if-missing`
  копирует flow только если соответствующего файла ещё нет
- `disabled`
  вообще не трогает flow-файлы

Режим по умолчанию сейчас:

```env
NIFI_BUNDLED_FLOW_MODE=replace
```

То есть при обычном деплое из git NiFi поднимется именно с тем flow, который закоммичен в репозиторий.

## Как обновить flow

Если у тебя есть новый экспорт из NiFi:

1. замени файлы:
   - `all_dockerfiles/local/datapipline/Nifi/bootstrap-flow/flow.xml.gz`
   - `all_dockerfiles/local/datapipline/Nifi/bootstrap-flow/flow.json.gz`
2. закоммить изменения
3. пересобери `nifi` image
4. пересоздай контейнер `nifi`

Пример:

```bash
docker compose --env-file docker-compose/.env -f docker-compose/data/docker-compose.yml build nifi
docker compose --env-file docker-compose/.env -f docker-compose/data/docker-compose.yml up -d nifi
```

Если нужно гарантированно пересоздать контейнер:

```bash
docker compose --env-file docker-compose/.env -f docker-compose/data/docker-compose.yml up -d --force-recreate nifi
```

## Что важно

- если flow меняли прямо в NiFi UI, а потом контейнер пересоздали в режиме `replace`, UI-изменения будут перезаписаны версией из git
- если хочешь временно сохранить runtime-изменения в контейнере, переключи:

```env
NIFI_BUNDLED_FLOW_MODE=if-missing
```

- для reproducible deploy лучше оставлять `replace`

## Рекомендованный workflow

Для команды безопаснее такой порядок:

1. меняем flow в тестовом NiFi
2. экспортируем `flow.xml.gz` и `flow.json.gz`
3. кладём их в `bootstrap-flow/`
4. коммитим и пушим
5. на сервере делаем rebuild `nifi`

Так NiFi process становится частью репозитория и разворачивается так же предсказуемо, как backend и frontend.
