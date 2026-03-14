import {
    SET_ALARM_HISTORY_DIAGNOSTIC,
    SET_COMMUNICATIONS_STATUS_DIAGNOSTIC,
    SET_SYSTEM_HEALTH_DIAGNOSTIC,
    CLEAN_DIAGNOSTIC,
    SET_LOGS_DIAGNOSTIC,
    CHANGE_ROW_COUNT_DIAGNOSTIC,
    CHANGE_PAGE_DIAGNOSTIC
} from "../types"
import { wsBaseUrl } from "../../baseApi";
import DiagnosticService from "../../api/diagnostic";

import { alarmHistory, system_health, communicationsStatus, logs_column } from "./columns";
import { uuidv4 } from "../../utils/uuidGenerator";

var W3CWebSocket = require("websocket").w3cwebsocket;
let sys_health;
let communications_status;

const getLayerName = (getState) =>
    String(getState()?.auth?.user?.active_layer || "STD").toLowerCase();


const loadSystemStatus = () => async (dispatch, getState) => {
    const layer = getLayerName(getState)
    const culture = getState()?.lang?.cultur
    const column = await system_health(culture)
    dispatch({
        type: SET_SYSTEM_HEALTH_DIAGNOSTIC,
        payload: { column, row: [] }
    })
    try {
        sys_health = new W3CWebSocket(
            `${wsBaseUrl}/ws/notifications/${layer}/${uuidv4()}/`
        );
        sys_health.onerror = function () {
            console.log("Connection Error");
        };
        sys_health.onopen = function () {
            console.log("connected");
        };
        sys_health.onclose = function () {
            console.log("WebSocket Client Closed sys healt");
        };
        sys_health.onmessage = function (e) {
            async function sendNumber() {
                if (sys_health.readyState === sys_health.OPEN) {
                    if (typeof e.data === "string") {
                        let row = JSON.parse(e.data);
                        dispatch({
                            type: SET_SYSTEM_HEALTH_DIAGNOSTIC,
                            payload: { column, row }
                        })
                    }
                    return true;
                }
            }
            sendNumber()
        }
    } catch (err) {
        return Promise.reject(err)
    }
}

const loadCommunicationsStatus = (time) => async (dispatch, getState) => {
    const layer = getLayerName(getState)
    const culture = getState()?.lang?.cultur
    const column = await communicationsStatus(culture)
    dispatch({
        type: SET_COMMUNICATIONS_STATUS_DIAGNOSTIC,
        payload: { column, row: [] }
    })
    try {
        communications_status = new W3CWebSocket(
            `${wsBaseUrl}/ws/communications/${layer}/${uuidv4()}/`
        );
        communications_status.onerror = function () {
            console.log("Connection Error");
        };
        communications_status.onopen = function () {
            console.log("connected");
        };
        communications_status.onclose = function () {
            console.log("WebSocket Client Closed");
        };
        communications_status.onmessage = function (e) {
            async function sendNumber() {
                if (communications_status.readyState === communications_status.OPEN) {
                    if (typeof e.data === "string") {
                        let jsonData = JSON.parse(e.data);
                        dispatch({
                            type: SET_COMMUNICATIONS_STATUS_DIAGNOSTIC,
                            payload: { column, row: jsonData }
                        })
                    }
                    return true;
                }
            }
            sendNumber()
        }
    } catch (err) {
        return Promise.reject(err)
    }
}

const loadAlarmsHistory = () => async (dispatch, getState) => {
    dispatch(changePage("alarmHistory", 0))
}


const loadLogs = () => async (dispatch, getState) => {
    dispatch(changePage("logs", 0))
}

export const loadDiagnostic = () => (dispatch, getState) => {
    const time = getState().diagnostic.timePicker
    closeWs()
    dispatch(loadSystemStatus())
    dispatch(loadCommunicationsStatus())
    dispatch(loadAlarmsHistory(time))
    dispatch(loadLogs(time))
}

const closeWs = () => {
    if (sys_health) {
        sys_health.close()
        sys_health = false
    }
    if (communications_status) {
        communications_status.close()
        communications_status = false
    }
}

export const cleanDiagnostic = () => dispatch => {
    closeWs()
    dispatch({ type: CLEAN_DIAGNOSTIC })
}
export const changePage = (type, page) => async (dispatch, getState) => {
    const culture = getState()?.lang?.cultur
    dispatch({
        type: CHANGE_PAGE_DIAGNOSTIC,
        payload: { type, page }
    })
    try {
        if (type === "logs") {
            let res = await DiagnosticService.logAlarm(page + 1)
            console.log(res);
            const column = await logs_column(culture)
            dispatch({
                type: CHANGE_ROW_COUNT_DIAGNOSTIC, payload: { type, val: res.data.count }
            })
            dispatch({
                type: SET_LOGS_DIAGNOSTIC,
                payload: { column, row: res.data.results }
            })
        }

        else {
            let res = await DiagnosticService.eventAlarm(page + 1)
            console.log(res);
            const column = await alarmHistory(culture)
            dispatch({
                type: CHANGE_ROW_COUNT_DIAGNOSTIC, payload: { type, val: res.data.count }
            })
            dispatch({
                type: SET_ALARM_HISTORY_DIAGNOSTIC,
                payload: { column, row: res.data.results }
            })
        }
    }
    catch { }

}
