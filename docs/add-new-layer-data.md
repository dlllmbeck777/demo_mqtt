# Add New Layer Data And Change Tab Labels

This project has two different kinds of customization:

1. adding a new data layer such as `STD`, `Horasan`, or another site
2. changing labels shown in UI tabs, menus, and titles

The important distinction is:

- data routing is controlled mostly by environment and database contents
- many UI labels come from metadata tables such as code lists and resource tables
- a smaller set of labels is hardcoded in the frontend and must be edited in code

## 1. Add a new layer or switch the active layer

The active layer should come from environment.

Primary environment variables:

- `DIAGNOSTIC_LAYER_NAME`
- `REACT_APP_LAYER_NAME`
- `COMPANY_NAME`

Current runtime fallback order in active code:

- backend: `DIAGNOSTIC_LAYER_NAME -> COMPANY_NAME -> STD`
- frontend: `REACT_APP_LAYER_NAME -> REACT_APP_DIAGNOSTIC_LAYER_NAME -> STD`

Relevant files:

- [service_config.py](d:/ligeiaai_backup_2025-05-11/ligeia.ai/backend/utils/service_config.py)
- [baseApi.js](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/services/baseApi.js)
- [bootstrap-historical-stack.sh](d:/ligeiaai_backup_2025-05-11/ligeia.ai/scripts/bootstrap-historical-stack.sh)

### Minimum env for a new layer

Example for `STD`:

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

Example for another layer such as `PlantA`:

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

## 2. Add the actual data

For a full historical layer rollout, data usually comes from:

- PostgreSQL dump for the main DB
- PostgreSQL dump for the layer DB
- CouchDB JSON export
- optional runtime data for Mongo/Influx/Kafka

Existing restore/bootstrap helpers:

- [restore-demo-horasan.sh](d:/ligeiaai_backup_2025-05-11/ligeia.ai/scripts/restore-demo-horasan.sh)
- [bootstrap-historical-stack.sh](d:/ligeiaai_backup_2025-05-11/ligeia.ai/scripts/bootstrap-historical-stack.sh)
- [data-restore.md](d:/ligeiaai_backup_2025-05-11/ligeia.ai/docs/data-restore.md)

### Practical sequence

1. Put the real dumps into `transfer/` or an offline bundle.
2. Set the layer env values listed above.
3. Restore PostgreSQL.
4. Import CouchDB JSON if your UI depends on it.
5. Start the app stack.
6. Verify that the selected layer matches:
   layer in auth/user state, Mongo database name, Influx bucket names, MQTT topic.

### What to verify after restore

- login works
- active layer can be selected
- left navigation loads
- overview dashboards load
- diagnostics websocket paths use the expected layer
- Mongo runtime documents are written into the expected database
- Influx queries hit the expected bucket

## 3. Change labels on Diagnostics tabs

Diagnostics tabs are not hardcoded in the component. They are loaded from code list metadata.

Source:

- [diagnosticEditor.jsx](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/pages/main/administration/diagnostics/diagnosticEditor.jsx)

The component loads:

- `LIST_TYPE = DIAGNOSTIC_PAGE_TAB`
- tab title text from `CODE_TEXT`
- tab order from `VAL1`

Frontend API used:

- [codeList.js](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/services/api/codeList.js)

So if you want to:

- rename a Diagnostics tab: update `CODE_TEXT`
- reorder tabs: update `VAL1`
- add a new tab entry: add a new code-list row under `DIAGNOSTIC_PAGE_TAB`

Important:

- the current diagnostics page still maps tab index to fixed data grids in code:
  [diagnosticEditor.jsx](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/pages/main/administration/diagnostics/diagnosticEditor.jsx)
- that means changing labels and order is safe
- adding a fifth tab is not enough by itself; you must also extend the page logic

## 4. Change labels on overview tabs

Overview dashboard tabs are user/dashboard data, not translation metadata.

Relevant files:

- [myTabs.jsx](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/components/tabs/myTabs.jsx)
- [taps.js](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/services/actions/overview/taps.js)
- [overview.js](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/services/api/overview.js)

Behavior:

- tab names come from dashboard `NAME`
- users can rename them directly in UI by double-clicking the tab
- rename is persisted through `/dashboard/save/`

So for overview tabs:

- quickest way: rename in the UI
- backend/data way: update dashboard `NAME` records in DB

Default new tab name is hardcoded as:

- `Untitled N`

in:

- [taps.js](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/services/actions/overview/taps.js)

If you want a different default naming pattern, change it there.

## 5. Change drawer and menu labels

Navigation metadata is served from the resource-drawer endpoint and related resource tables.

Relevant backend:

- [views.py](d:/ligeiaai_backup_2025-05-11/ligeia.ai/backend/apps/resources_drawer/views.py)

Key fields used there:

- `resources_drawer.SHORT_LABEL`
- `resources_drawer.MOBILE_LABEL`
- `resources_drawer.PATH`

So for drawer/navigation labels coming from resource drawer metadata:

- rename by editing the corresponding `resources_drawer` rows
- keep `CULTURE` in mind if you support multiple languages

There is also a second metadata pattern in this project:

- many UI labels are resolved by `LABEL_ID -> SHORT_LABEL`
- for example type/resource labels are loaded through resource tables and serializers

That means if a screen label is not hardcoded in frontend, first check whether it comes from:

- `CODE_TEXT`
- `SHORT_LABEL`
- `MOBILE_LABEL`
- `LABEL_ID`

## 6. Hardcoded frontend labels

Some tab-related labels are still hardcoded in frontend code.

Examples:

- browser tab title:
  [index.html](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/public/index.html)
- overview tab context menu items like `Save`, `Delete`, `Copy`, `Paste`:
  [tabMenu.jsx](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/components/tabs/tabMenu.jsx)
- confirmation text like `Are you sure you want to delete ?`:
  [myTabs.jsx](d:/ligeiaai_backup_2025-05-11/ligeia.ai/frontend/src/components/tabs/myTabs.jsx)

Those are not metadata-driven today. To change them, edit the frontend files directly.

## 7. Fast decision guide

If you want to change:

- active layer routing: change env
- Influx/MQTT/Mongo target names: change env
- Diagnostics tab titles: change code-list metadata
- Diagnostics tab count/behavior: change frontend code
- Overview tab names: rename in UI or update dashboard `NAME`
- Drawer labels: change `resources_drawer` metadata
- browser tab title: edit `frontend/public/index.html`
- context-menu action text on tabs: edit `frontend/src/components/tabs/*.jsx`

## 8. Safe workflow

When you are not sure where a label comes from, check in this order:

1. Search frontend for the visible text.
2. If not found, inspect the component for `CODE_TEXT`, `SHORT_LABEL`, `MOBILE_LABEL`, or `LABEL_ID`.
3. If the component loads metadata from API, update the DB/config source instead of hardcoding.
4. If it is overview tab naming, prefer UI rename first.

That keeps the project consistent and avoids baking site-specific wording into code.
