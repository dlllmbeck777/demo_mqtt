# Offline bundle и офлайн-подъём

Теперь в репо есть скрипт:

- [create-offline-bundle.sh](d:/ligeaai_backup_2025-05-11/ligeia.ai/scripts/create-offline-bundle.sh)

Он собирает готовый bundle для переноса на другой сервер без интернета.

Что кладётся в bundle:

- docker image tar-файлы
- архив проекта `demo_mqtt-project.tar.gz`
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
- восстановит PostgreSQL
- импортирует CouchDB
- запустит stack через [bootstrap-historical-stack.sh](d:/ligeaai_backup_2025-05-11/ligeia.ai/scripts/bootstrap-historical-stack.sh)

## Что важно

- если `transfer/*.sql` остались Git LFS pointer-файлами, bundle будет неполным для полноценного restore
- для reproducible deploy лучше собирать bundle после `git pull` и после успешной локальной/серверной проверки image build
- `deploy-from-bundle.sh` по умолчанию поднимает тот же `STACK_MODE`, в котором bundle был собран
