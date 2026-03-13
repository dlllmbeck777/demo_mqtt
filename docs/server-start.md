# Server Start

## Fast path

1. Install Docker Engine and Docker Compose plugin on the server.
2. Clone the repository.
3. Create `.env` from [.env.example](/d:/ligeaai_backup_2025-05-11/ligeia.ai/.env.example).
4. Start the infrastructure services.
5. Run Django migrations.
6. Start the application services.

## Recommended `.env` values for Docker

Use container service names, not `localhost`, for internal connections:

```env
PG_HOST=postgres
PG_PORT=5432
REDIS_HOST=redis
REDIS_URI=redis:6379/1
REDIS_TS_HOST=redis-ts
Elastic_Search_Host=http://elasticsearch:9200
COUCHDB_HOST=couchserver
COUCHDB_PORT=5984
COUCHDB_URL=http://admin:change-me@couchserver:5984/
APP_API_BASE_URL=http://YOUR_SERVER_IP:8000
REACT_APP_API_BASE_URL=http://YOUR_SERVER_IP:8000
REACT_APP_WS_BASE_URL=ws://YOUR_SERVER_IP:8000
REACT_APP_COUCHDB_URL=http://YOUR_SERVER_IP:5984/
INFLUX_HOST=http://YOUR_INFLUX_HOST:8086
REACT_APP_INFLUX_URL=http://YOUR_INFLUX_HOST:8086
```

If `.env` is missing, the compose file now has safe bootstrap defaults for PostgreSQL, CouchDB and pgAdmin. You can still start faster with `cp .env.example .env`, then edit only the values you need.

If InfluxDB runs in the same server from the separate stack, use `http://YOUR_SERVER_IP:8086` for the frontend and `http://host.docker.internal:8086` or a reachable container/network address for backend access.

## Start core stack

From the project root:

```bash
docker compose up -d --build postgres redis redis-ts couchserver elasticsearch mongodb-timescale
docker compose run --rm django bash -lc "cd backend && python manage.py migrate"
docker compose up -d --build django frontend client
```

Do not start the whole file with bare `docker compose up` for the first boot. The compose file also contains optional Kafka/NiFi services, and they are not required to bring up the UI and API.

The UI will be available on:

- `http://SERVER_IP/` through nginx
- `http://SERVER_IP:3000/` directly from the React dev server
- `http://SERVER_IP:8000/` for Django API
- PostgreSQL is internal-only by default and is no longer published on host port `5434`

## Start optional data stack

If dashboards need historical Influx data or MQTT/Kafka/NiFi flows, start these separately:

```bash
docker compose -f docker-compose/data/docker-compose.yml up -d influxdb1 zookeeper apache-kafka-broker1 rabbitmq mosquitto nifi
```

If you also need the alternate DB stack from `docker-compose/db`, create the external network first:

```bash
docker network create app_net
docker compose -f docker-compose/db/docker-compose.yml up -d
```

## Restore saved data

- PostgreSQL dashboards and metadata: restore your `pg_dump` backup into the `postgres` service.
- CouchDB: restore only if you need saved tree state.
- MongoDB and InfluxDB: restore only if you need historical data.

## Known limitations

- The Django container uses `runserver`, not gunicorn. This is acceptable for first deployment, not ideal for production hardening.
- Frontend runs through the React dev server. For a hardened production setup, build static assets and serve them with nginx.
- `docker compose.yml` is now fixed for the actual Dockerfile paths, but `.devcontainer/docker-compose.yml` is still legacy and should not be used for server deployment.
