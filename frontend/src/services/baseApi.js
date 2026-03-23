import axios from "axios";

const browserHost =
    typeof window !== "undefined" && window.location?.hostname
        ? window.location.hostname
        : "localhost";
const defaultApiBaseUrl = `http://${browserHost}:8000`;
const baseUrl = process.env.REACT_APP_API_BASE_URL || defaultApiBaseUrl;
const defaultWsBaseUrl = baseUrl.replace(/^http/, "ws");
const apiVersion = process.env.REACT_APP_API_VERSION || "/api/v1";
export const layerName = (
    process.env.REACT_APP_LAYER_NAME ||
    process.env.REACT_APP_DIAGNOSTIC_LAYER_NAME ||
    "Inkai"
).toLowerCase();

export const wsBaseUrl = process.env.REACT_APP_WS_BASE_URL || defaultWsBaseUrl;
export const instance = axios.create({
    baseURL: `${baseUrl}${apiVersion}`
});

export const config = () => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`,
        }
    }
};

export const unAuthConfig = {
    headers: {
        'Content-Type': 'application/json'
    }
}

export const influxUrl =
    process.env.REACT_APP_INFLUX_URL || `http://${browserHost}:8086`;
export const backfillBucket =
    process.env.REACT_APP_INFLUX_BACKFILL_BUCKET || `${layerName}_backfill`;
export const backfillAlarmBucket =
    process.env.REACT_APP_INFLUX_BACKFILL_ALARM_BUCKET || `${layerName}_backfill_alarms`;
export const backfillLogsBucket =
    process.env.REACT_APP_INFLUX_BACKFILL_LOGS_BUCKET || `${layerName}_backfill_logs`;
export const influxToken =
    process.env.REACT_APP_INFLUX_TOKEN ||
    "CHANGE_ME_IN_ENV";
export const influxOrg = process.env.REACT_APP_INFLUX_ORG || "nordal";
export const liveBucket =
    process.env.REACT_APP_INFLUX_LIVE_BUCKET || `${layerName}_live`;
export const anomalyBucket =
    process.env.REACT_APP_INFLUX_ANOMALY_BUCKET || liveBucket;
