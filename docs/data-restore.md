# Data Restore

## What is actually needed

For this project, the minimum useful restore is PostgreSQL.

That database contains:

- users and roles
- dashboard definitions
- widget layout and widget properties
- item, tag and type metadata
- layer definitions and most application configuration

Without restoring PostgreSQL, the app will start but you will only see an empty login flow and an almost blank system.

## What is not in this repository

This repository does not contain a full working production dump.

What is present locally:

- code and configuration
- some seed/reference files under `backend/services/parsers/addData/type`
- optional MongoDB files under `docker-compose/db/data`

What is usually missing and must come from the old environment:

- PostgreSQL dump with users, dashboards and metadata
- CouchDB export if you need saved tree state
- InfluxDB and MongoDB history if charts must show old historical data

## Fastest path

1. Copy the PostgreSQL dump from the old environment to the new server.
2. Run the restore script from the project root.
3. Restart Django and log in with an existing restored user.

Example:

```bash
chmod +x scripts/restore-postgres.sh
./scripts/restore-postgres.sh ~/transfer/ligeia.dump
```

For a plain SQL dump:

```bash
./scripts/restore-postgres.sh ~/transfer/ligeia.sql
```

## If you have no PostgreSQL dump

You have two fallback options:

1. Create a new admin user and rebuild the configuration manually.
2. Seed only the reference dictionaries and recreate dashboards from scratch.

Admin user example:

```bash
docker compose run --rm django bash -lc "cd backend && python manage.py createsuperuser"
```

This is enough to enter the system, but it does not restore dashboards, tags, equipment mappings or users from the previous environment.

## Optional restores

- CouchDB: restore only if operators need saved tree state.
- MongoDB: restore only if application logic depends on stored event documents.
- InfluxDB: restore only if historical trends and backfill charts are required.

## Important note about multiple databases

If the old system used separate PostgreSQL databases for layers such as `STD`, `Horasan` or others, restoring only one dump may not be enough.

Check the `layer` records in PostgreSQL after restore. If `DB_SETTINGS.NAME` points to extra databases, restore those databases too.
