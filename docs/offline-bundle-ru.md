# Offline bundle и офлайн-подъём

Теперь в репо есть скрипт:

- [create-offline-bundle.sh](d:/ligeaai_backup_2025-05-11/ligeia.ai/scripts/create-offline-bundle.sh)

Он собирает готовый bundle для переноса на другой сервер без интернета.

Что кладётся в bundle:

- docker image tar-файлы
- архив проекта `demo_mqtt-project.tar.gz`
- снимок `docker-compose/.env` как `docker-compose.env`
- `VERSION.txt`
- `bundle-manifest.json`
- `images.txt`
- `transfer/demo_dump.sql`
- `transfer/horasan_dump.sql`
- `transfer/demo_db.json`
- `transfer/treeviewstate_db.json`
- `load-all-images.sh`
- `deploy-from-bundle.sh`

## Режимы

Скрипт поддерживает 3 режима:

- `light`
  только core stack: PostgreSQL, Redis, CouchDB, Mongo, Influx, Django, Frontend, nginx
- `pipeline`
  `light` + MQTT/Kafka/NiFi simulation stack
- `full`
  `pipeline` + admin/extra services вроде `connect`, `control-center`, `kafdrop`, `pgadmin`, `mongo-express`, `elasticsearch`

По умолчанию:

```bash
./scripts/create-offline-bundle.sh
```

это режим:

```bash
pipeline
```

То есть он уже пригоден для офлайн-подъёма без `elasticsearch`, `kafdrop` и других тяжёлых лишних сервисов, но с MQTT/NiFi/Kafka для тестов потока данных.

## Как собрать bundle

На машине с интернетом:

```bash
cd ~/mqtt_broker/demo_mqtt
chmod +x scripts/create-offline-bundle.sh
./scripts/create-offline-bundle.sh pipeline
```

После сборки bundle рядом появятся:

- `offline_bundle/VERSION.txt` с именем релиза, веткой, commit hash и временем сборки
- `offline_bundle/bundle-manifest.json` с теми же метаданными в JSON
- `offline_bundle/docker-compose.env` со снимком текущего `.env`

Это полезно, когда нужно перенести именно проверенную рабочую версию, а не просто "какой-то архив".

Если нужен самый лёгкий вариант:

```bash
./scripts/create-offline-bundle.sh light
```

Если нужен полный набор:

```bash
./scripts/create-offline-bundle.sh full
```

## Как поднять на сервере без интернета

1. скопировать всю папку `offline_bundle` на целевой сервер
2. на сервере запустить:

```bash
bash offline_bundle/deploy-from-bundle.sh
```

Можно передать свои переменные:

```bash
SERVER_IP=65.109.174.58 TARGET_LAYER=Inkai bash offline_bundle/deploy-from-bundle.sh
```

Если нужно руками переопределить набор сервисов на целевом сервере:

```bash
SERVER_IP=65.109.174.58 TARGET_LAYER=Inkai STACK_MODE=light bash offline_bundle/deploy-from-bundle.sh
```

Скрипт сам:

- распакует проект
- загрузит docker images из tar
- восстановит `docker-compose/.env` из `docker-compose.env`, если снимок есть в bundle
- восстановит PostgreSQL
- импортирует CouchDB
- запустит stack через [bootstrap-historical-stack.sh](d:/ligeaai_backup_2025-05-11/ligeia.ai/scripts/bootstrap-historical-stack.sh)

## Рекомендуемый сценарий для текущей рабочей ветки

Если текущая версия на тестовом сервере уже показала себя нормально, то безопасный путь такой:

1. на машине с интернетом перейти на нужную ветку и убедиться, что локальный код соответствует рабочему коммиту
2. собрать bundle в режиме `pipeline`
3. проверить, что в `offline_bundle/VERSION.txt` лежит ожидаемый commit hash
4. перенести всю папку `offline_bundle` на прод-сервер без интернета
5. на прод-сервере выполнить `bash offline_bundle/deploy-from-bundle.sh`

Пример:

```bash
cd ~/mqtt_broker/demo_mqtt
git checkout optimization/two-phase-runtime-cleanup
git pull
./scripts/create-offline-bundle.sh pipeline
cat offline_bundle/VERSION.txt
```

## Что важно

- если `transfer/*.sql` остались Git LFS pointer-файлами, bundle будет неполным для полноценного restore
- для reproducible deploy лучше собирать bundle после `git pull` и после успешной локальной/серверной проверки image build
- `deploy-from-bundle.sh` по умолчанию поднимает тот же `STACK_MODE`, в котором bundle был собран
