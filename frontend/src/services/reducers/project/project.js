import {
    UPDATE_DATA_PROJECT,
    LOAD_DATA_PROJECT,
    CLEAN_PROJECT,
    SET_DATABASES_PROJECT,
    SET_KUBERNETES_PROJECT
} from "../../actions/types"


const initialState = {
    data: {},
    databases: [],
    kubernetes: []
};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case SET_KUBERNETES_PROJECT:
            return {
                ...state,
                kubernetes: payload
            }
        case SET_DATABASES_PROJECT:
            return {
                ...state,
                databases: payload
            }
        case UPDATE_DATA_PROJECT:
            return {
                ...state,
                data: { ...state.data, [payload.key]: payload.value }
            }
        case LOAD_DATA_PROJECT:
            return {
                ...state,
                data: payload
            }
        case CLEAN_PROJECT:
            return {
                ...state,
                data: {},
                kubernetes: []
            }
        default:
            return {
                ...state,
            }
    }
};
