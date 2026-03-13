# Migration Checklist

## What to export

Mandatory:

- PostgreSQL full dump. This is where dashboard definitions, widget layout, metadata, items, tags, roles and most application configuration live.
- At minimum, preserve the tables behind these apps if you do a partial export: `bi_dashbord`, `bi_widgets`, `bi_layouts`, `bi_widget_property`, `bi_widget_type`, `item`, `item_property`, `item_link`, `tags`, `tags_calculated`, `type`, `type_property`, `type_link`, `uom`, `uom_base_unit`, `resources_types`, `layer`, `roles`, `roles_property`.

Optional:

- CouchDB if you need saved tree state or seed documents used for layer initialization.
- MongoDB only if you need historical documents that are not reproducible from upstream systems.
- InfluxDB only if you need historical trends, backfill charts or anomaly history.

Usually not worth migrating:

- Redis / RedisTimeSeries cache and ephemeral live state.
- Kafka topics, NiFi runtime state and local frontend dependencies.

## Recommended export order

1. Export PostgreSQL.
2. Export CouchDB if operators rely on saved tree state.
3. Export MongoDB and InfluxDB only when history is required.
4. Recreate `.env` from [.env.example](/d:/ligeaai_backup_2025-05-11/ligeia.ai/.env.example).
5. Install frontend dependencies on the new host and rebuild the frontend.

## PostgreSQL

Preferred:

```powershell
pg_dump -h localhost -p 5434 -U postgres -d ligeia -F c -f .\transfer-export\postgres\ligeia.dump
```

If PostgreSQL runs only inside Docker:

```powershell
docker exec -t ligeiaai-postgres-1 pg_dump -U "$env:PG_USER" -d "$env:PG_DB" -F c > .\transfer-export\postgres\ligeia.dump
```

## CouchDB

Export the databases you actually use, especially `treeviewstate` and any seed databases needed for bootstrapping:

```powershell
curl.exe -u admin:password http://localhost:5984/_all_dbs
curl.exe -u admin:password http://localhost:5984/treeviewstate > .\transfer-export\couchdb\treeviewstate.json
```

## MongoDB

Export only if historical collections matter:

```powershell
mongodump --host localhost --port 27017 --username admin --password password --authenticationDatabase admin --out .\transfer-export\mongo
```

## InfluxDB

Export only if history/backfill must be kept. On InfluxDB 2.x the usual path is bucket export or backup from inside the server environment:

```powershell
influx backup .\transfer-export\influx --host http://localhost:8086 --token $env:INFLUX_DB_TOKEN
```

## Minimum viable migration

For the fastest redeploy with similar dashboards and new equipment:

- Export PostgreSQL.
- Recreate `.env` on the new host.
- Reinstall frontend dependencies.
- Rebind equipment and tag mappings in PostgreSQL.
- Skip CouchDB, MongoDB and InfluxDB unless you need historical state.
