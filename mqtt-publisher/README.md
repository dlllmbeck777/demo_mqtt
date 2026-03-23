# MQTT Publisher

Standalone MQTT traffic simulator for Inkai pump telemetry.

## Start

```bash
cp .env.example .env
docker compose up -d --build
docker compose logs -f
```

By default it publishes to `65.109.174.58:1883` on topic `iot-inkai-raw`.

## Stop

```bash
docker compose down
```

## Override tag ids directly

If you want to bypass the default pump list, set `MQTT_PUBLISHER_TAG_IDS` in `.env`:

```env
MQTT_PUBLISHER_TAG_IDS=plant.inkai.custom.p-1.current,plant.inkai.custom.p-2.current
```
