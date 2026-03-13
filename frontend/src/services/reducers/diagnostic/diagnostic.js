import {
    SET_ALARM_HISTORY_DIAGNOSTIC,
    SET_COMMUNICATIONS_STATUS_DIAGNOSTIC,
    SET_SYSTEM_HEALTH_DIAGNOSTIC,
    CLEAN_DIAGNOSTIC,
    UPDATE_TIMEPICKER_DIAGNOSTIC,
    SET_LOGS_DIAGNOSTIC,
    CHANGE_TIME_INTERVAL_DIAGNOSTIC,
    CHANGE_ROW_COUNT_DIAGNOSTIC,
    CHANGE_PAGE_DIAGNOSTIC
} from "../../actions/types"

const initialState = {
    alarmHistory: {
        column: [],
        row: [],
        loading: true,
        startDateTime: new Date().getTime() - 86400000,
        endDateTime: new Date().getTime() - 172800000,
        rowCount: 0,
        page: 0
    },
    communicationsStatus: {
        column: [],
        row: [],
        loading: true
    },
    systemHealth: {
        column: [],
        row: [],
        loading: true
    },
    logs: {
        column: [],
        row: [],
        loading: true,
        startDateTime: new Date().getTime() - 86400000,
        endDateTime: new Date().getTime() - 172800000,
        rowCount: 0,
        page: 0
    },
    timePicker: 1,

};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case CHANGE_PAGE_DIAGNOSTIC:
            return {
                ...state,
                [payload.type]: {
                    ...state[payload.type],
                    page: payload.page,
                    loading: true
                }
            }
        case CHANGE_TIME_INTERVAL_DIAGNOSTIC:
            return {
                ...state,
                [payload.type]: {
                    ...state[payload.type],
                    [payload.key]: payload.val,
                    loading: true
                }
            }
        case CHANGE_ROW_COUNT_DIAGNOSTIC:
            return {
                ...state,
                [payload.type]: {
                    ...state[payload.type],
                    rowCount: payload.val
                }
            }
        case UPDATE_TIMEPICKER_DIAGNOSTIC:
            return {
                ...state,
                timePicker: payload,
                alarmHistory: {
                    ...state.alarmHistory,
                    loading: true
                },
                communicationsStatus: {
                    ...state.communicationsStatus,
                    loading: true
                },
                systemHealth: {
                    ...state.systemHealth,
                    loading: true
                },
                logs: {
                    ...state.logs,
                    loading: true
                },
            }
        case SET_ALARM_HISTORY_DIAGNOSTIC:
            return {
                ...state,
                alarmHistory: {
                    ...state.alarmHistory,
                    column: payload.column,
                    row: payload.row,
                    loading: false
                }
            }
        case SET_COMMUNICATIONS_STATUS_DIAGNOSTIC:
            return {
                ...state,
                communicationsStatus: {
                    column: payload.column,
                    row: payload.row,
                    loading: false
                }
            }
        case SET_SYSTEM_HEALTH_DIAGNOSTIC:
            return {
                ...state,
                systemHealth: {
                    column: payload.column,
                    row: payload.row,
                    loading: false
                }
            }
        case SET_LOGS_DIAGNOSTIC:
            return {
                ...state,
                logs: {
                    ...state.logs,
                    column: payload.column,
                    row: payload.row,
                    loading: false
                }
            }
        case CLEAN_DIAGNOSTIC:
            return {
                ...state,
                alarmHistory: {
                    column: [],
                    row: [],
                    loading: true,
                    startDateTime: new Date().getTime() - 86400000,
                    endDateTime: new Date().getTime() - 172800000,
                    rowCount: 0,
                    page: 0
                },
                communicationsStatus: {
                    column: [],
                    row: [],
                    loading: true
                },
                systemHealth: {
                    column: [],
                    row: [],
                    loading: true
                },
                logs: {
                    column: [],
                    row: [],
                    loading: true,
                    startDateTime: new Date().getTime() - 86400000,
                    endDateTime: new Date().getTime() - 172800000,
                    rowCount: 0,
                    page: 0
                },

            }
        default:
            return {
                ...state,
            }
    }
};

