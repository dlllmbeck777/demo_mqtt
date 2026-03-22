# Как добавить новый layer, данные и изменить подписи вкладок

В этом проекте есть два разных типа настройки:

1. добавление нового слоя данных, например `STD`, `Horasan` или другого site/layer
2. изменение подписей во вкладках, меню и навигации UI

Ключевая разница такая:

- маршрутизация данных в основном управляется через environment и содержимое баз
- многие подписи в UI приходят из metadata-таблиц, а не из хардкода фронта
- часть текстов всё ещё зашита во frontend и меняется только в коде

## 1. Как добавить новый layer или переключить активный layer

Активный layer должен задаваться через environment.

Основные переменные:

- `DIAGNOSTIC_LAYER_NAME`
- `REACT_APP_LAYER_NAME`
- `COMPANY_NAME`

Текущий порядок fallback в активном коде:

- backend: `DIAGNOSTIC_LAYER_NAME -> COMPANY_NAME -> STD`
- frontend: `REACT_APP_LAYER_NAME -> REACT_APP_DIAGNOSTIC_LAYER_NAME -> STD`

Основные файлы:

- [service_config.py](d:/ligeiaai_backup_2025-05-11/ligeia.ai/backend/utils/service_config.py)
- [baseApi.js](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/services/baseApi.js)
- [bootstrap-historical-stack.sh](d:/ligeiaai_backup_2025-05-11/ligeia.ai/scripts/bootstrap-historical-stack.sh)

### Минимальный env для нового layer

Пример для `STD`:

```env
DIAGNOSTIC_LAYER_NAME=STD
REACT_APP_LAYER_NAME=STD
COMPANY_NAME=STD

INFLUX_LIVE_BUCKET=std_live
INFLUX_BACKFILL_BUCKET=std_backfill
INFLUX_BACKFILL_ALARM_BUCKET=std_backfill_alarms
INFLUX_BACKFILL_LOGS_BUCKET=std_backfill_logs
INFLUX_ALARMS_BUCKET=std_alarms
INFLUX_NOTIFICATIONS_BUCKET=std_notifications
INFLUX_LOGS_BUCKET=std_logs
INFLUX_ANOMALY_BUCKET=std_live

REACT_APP_INFLUX_LIVE_BUCKET=std_live
REACT_APP_INFLUX_BACKFILL_BUCKET=std_backfill
REACT_APP_INFLUX_BACKFILL_ALARM_BUCKET=std_backfill_alarms
REACT_APP_INFLUX_BACKFILL_LOGS_BUCKET=std_backfill_logs
REACT_APP_INFLUX_ANOMALY_BUCKET=std_live

MQTT_TOPIC=iot-std-raw
```

Пример для нового слоя, например `PlantA`:

```env
DIAGNOSTIC_LAYER_NAME=PlantA
REACT_APP_LAYER_NAME=PlantA
COMPANY_NAME=PlantA

INFLUX_LIVE_BUCKET=planta_live
INFLUX_BACKFILL_BUCKET=planta_backfill
INFLUX_BACKFILL_ALARM_BUCKET=planta_backfill_alarms
INFLUX_BACKFILL_LOGS_BUCKET=planta_backfill_logs
INFLUX_ALARMS_BUCKET=planta_alarms
INFLUX_NOTIFICATIONS_BUCKET=planta_notifications
INFLUX_LOGS_BUCKET=planta_logs
INFLUX_ANOMALY_BUCKET=planta_live

REACT_APP_INFLUX_LIVE_BUCKET=planta_live
REACT_APP_INFLUX_BACKFILL_BUCKET=planta_backfill
REACT_APP_INFLUX_BACKFILL_ALARM_BUCKET=planta_backfill_alarms
REACT_APP_INFLUX_BACKFILL_LOGS_BUCKET=planta_backfill_logs
REACT_APP_INFLUX_ANOMALY_BUCKET=planta_live

MQTT_TOPIC=iot-planta-raw
```

## 2. Как добавить сами данные

Для полного исторического разворота layer обычно нужны:

- PostgreSQL dump основной базы
- PostgreSQL dump layer-базы
- CouchDB JSON export
- при необходимости runtime-данные для Mongo/Influx/Kafka

Существующие helper scripts:

- [restore-demo-horasan.sh](d:/ligeiaai_backup_2025-05-11/ligeia.ai/scripts/restore-demo-horasan.sh)
- [bootstrap-historical-stack.sh](d:/ligeiaai_backup_2025-05-11/ligeia.ai/scripts/bootstrap-historical-stack.sh)
- [data-restore.md](d:/ligeiaai_backup_2025-05-11/ligeia.ai/docs/data-restore.md)

### Практический порядок

1. Положить реальные dump/json файлы в `transfer/` или в offline bundle.
2. Выставить layer env из блока выше.
3. Восстановить PostgreSQL.
4. Импортировать CouchDB JSON, если UI от него зависит.
5. Поднять app stack.
6. Проверить, что выбранный layer совпадает в:
   auth/user state, Mongo database, Influx buckets и MQTT topic.

### Что проверять после restore

- работает login
- можно выбрать активный layer
- загружается левое меню
- загружаются overview dashboards
- diagnostics websocket paths идут в правильный layer
- runtime документы в Mongo пишутся в ожидаемую базу
- Influx запросы идут в правильный bucket

## 3. Как менять подписи вкладок Diagnostics

Вкладки Diagnostics не захардкожены в компоненте. Они грузятся из code list metadata.

Источник:

- [diagnosticEditor.jsx](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/pages/main/administration/diagnostics/diagnosticEditor.jsx)

Компонент использует:

- `LIST_TYPE = DIAGNOSTIC_PAGE_TAB`
- текст вкладки из `CODE_TEXT`
- порядок вкладок из `VAL1`

Frontend API:

- [codeList.js](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/services/api/codeList.js)

То есть:

- чтобы переименовать вкладку Diagnostics, меняй `CODE_TEXT`
- чтобы поменять порядок, меняй `VAL1`
- чтобы добавить новую запись вкладки, добавляй новую строку в code-list под `DIAGNOSTIC_PAGE_TAB`

Важно:

- текущая страница Diagnostics всё ещё жёстко маппит index вкладки на конкретный grid в коде:
  [diagnosticEditor.jsx](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/pages/main/administration/diagnostics/diagnosticEditor.jsx)
- поэтому менять названия и порядок можно безопасно
- но просто добавить пятую вкладку в metadata недостаточно, нужно ещё расширить frontend-логику

## 4. Как менять названия overview tabs

Вкладки overview dashboards идут не из translation metadata, а из dashboard-данных.

Файлы:

- [myTabs.jsx](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/components/tabs/myTabs.jsx)
- [taps.js](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/services/actions/overview/taps.js)
- [overview.js](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/services/api/overview.js)

Поведение:

- имя вкладки берётся из dashboard `NAME`
- пользователь может переименовать её прямо в UI двойным кликом
- новое имя сохраняется через `/dashboard/save/`

Поэтому для overview tabs:

- самый быстрый путь: переименовать через UI
- backend/data путь: обновить поле `NAME` у dashboard в БД

Дефолтное имя новой вкладки сейчас хардкожено как:

- `Untitled N`

в:

- [taps.js](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/services/actions/overview/taps.js)

Если нужен другой шаблон имён по умолчанию, менять надо там.

## 5. Как менять подписи drawer и menu

Навигация в drawer приходит из resource-drawer endpoint и связанных metadata-таблиц.

Основной backend:

- [views.py](d:/ligeiaai_backup_2025-05-11/ligeia.ai/backend/apps/resources_drawer/views.py)

Ключевые поля:

- `resources_drawer.SHORT_LABEL`
- `resources_drawer.MOBILE_LABEL`
- `resources_drawer.PATH`

То есть для drawer/navigation labels:

- переименование делается через обновление строк в `resources_drawer`
- нужно учитывать `CULTURE`, если поддерживается несколько языков

Есть и второй metadata-паттерн:

- многие подписи в UI берутся как `LABEL_ID -> SHORT_LABEL`
- например type/resource labels приходят через resource tables и serializers

Если подпись не хардкожена во frontend, сначала проверь, не идёт ли она из:

- `CODE_TEXT`
- `SHORT_LABEL`
- `MOBILE_LABEL`
- `LABEL_ID`

## 6. Какие подписи всё ещё хардкожены во frontend

Часть текстов вкладок и меню всё ещё зашита прямо в коде frontend.

Примеры:

- заголовок browser tab:
  [index.html](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/public/index.html)
- пункты context menu у overview tab: `Save`, `Delete`, `Copy`, `Paste`:
  [tabMenu.jsx](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/components/tabs/tabMenu.jsx)
- confirm text вроде `Are you sure you want to delete ?`:
  [myTabs.jsx](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/components/tabs/myTabs.jsx)

Эти места не metadata-driven. Их нужно менять прямо в frontend-файлах.

## 7. Быстрый guide: где что менять

Если нужно изменить:

- активный layer routing: меняй env
- Influx/MQTT/Mongo target names: меняй env
- названия Diagnostics tabs: меняй code-list metadata
- количество или поведение Diagnostics tabs: меняй frontend code
- названия overview tabs: переименовывай в UI или меняй dashboard `NAME`
- drawer labels: меняй `resources_drawer`
- browser tab title: меняй `frontend/public/index.html`
- тексты в tab context menu: меняй `frontend/src/components/tabs/*.jsx`

## 8. Безопасный workflow

Если неясно, откуда берётся надпись, смотри в таком порядке:

1. Найди текст поиском по frontend.
2. Если текста нет, посмотри, не использует ли компонент `CODE_TEXT`, `SHORT_LABEL`, `MOBILE_LABEL` или `LABEL_ID`.
3. Если компонент грузит metadata через API, меняй источник в БД/конфиге, а не хардкод.
4. Если речь про overview tabs, сначала предпочитай rename через UI.

Так проект остаётся консистентным, и site-specific тексты не зашиваются в код без необходимости.
