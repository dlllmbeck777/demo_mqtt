# Historical Stack

This project keeps a split historical deployment layout under [docker-compose](/d:/ligeaai_backup_2025-05-11/ligeia.ai/docker-compose):

- [docker-compose/app/docker-compose.yml](/d:/ligeaai_backup_2025-05-11/ligeia.ai/docker-compose/app/docker-compose.yml)
- [docker-compose/db/docker-compose.yml](/d:/ligeaai_backup_2025-05-11/ligeia.ai/docker-compose/db/docker-compose.yml)
- [docker-compose/data/docker-compose.yml](/d:/ligeaai_backup_2025-05-11/ligeia.ai/docker-compose/data/docker-compose.yml)

Use one shared env file for all three stacks:

```bash
cp docker-compose/.env.example docker-compose/.env
```

Use `docker-compose/.env` as the source of truth for the split stack. Do not rely on the older per-folder `app/.env`, `db/.env` or `data/.env` files.

Or use the helper script after editing `docker-compose/.env`:

```bash
chmod +x scripts/start-historical-stack.sh scripts/stop-historical-stack.sh
./scripts/start-historical-stack.sh
```

If you pulled SQL dumps from Git, fetch the real content before restore:

```bash
git lfs pull
```

Edit at least:

- `ALLOWED_HOSTS`
- `APP_API_BASE_URL`
- `BACKEND_BASE_URL`
- `REACT_APP_API_BASE_URL`
- `REACT_APP_WS_BASE_URL`
- `REACT_APP_COUCHDB_URL`
- `REACT_APP_INFLUX_URL`
- `NIFI_API_URL`

For the split historical stack, keep these internal service names:

- PostgreSQL: `postgres`
- Redis: `redis`
- RedisTimeSeries: `redis-ts`
- CouchDB: `couchserver`
- Elasticsearch: `elasticsearch`
- MongoDB: `mongo-dev`
- InfluxDB: `influxdb1`
- Kafka broker: `broker`

## Start Order

```bash
docker network inspect app_net >/dev/null 2>&1 || docker network create app_net
docker compose --env-file docker-compose/.env -f docker-compose/db/docker-compose.yml up -d
docker compose --env-file docker-compose/.env -f docker-compose/data/docker-compose.yml up -d
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml build django frontend
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml run --rm django bash -lc "cd backend && python manage.py migrate"
docker compose --env-file docker-compose/.env -f docker-compose/app/docker-compose.yml up -d
```

## Restore Data

Restore PostgreSQL first, then optional historical stores:

- PostgreSQL dump into `demo` and additional layer DBs like `horasan`
- CouchDB if you need tree state
- MongoDB only if you need historical documents
- InfluxDB only if you need historical trends and backfill

## Access

- UI through nginx: `http://SERVER_IP/`
- React dev server: `http://SERVER_IP:3000/`
- Django API: `http://SERVER_IP:8000/`
- pgAdmin: `http://SERVER_IP:5050/`
- CouchDB: `http://SERVER_IP:5984/`
- Mongo Express: `http://SERVER_IP:8081/`
- NiFi: `http://SERVER_IP:8082/`
- Kafka UI: `http://SERVER_IP:9000/`
- Control Center: `http://SERVER_IP:9021/`

## Notes

- `docker-compose/db/data` is still used as the Mongo bind mount in the historical DB stack.
- The historical stack now uses named volumes for InfluxDB instead of old host-specific `/mnt/data/...` paths.
- `elasticsearch` was restored into the split DB stack because Django configuration expects it.
