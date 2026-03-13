import {
    LOAD_PROFILE,
    CLEAN_PROFILE,
    SELECT_PAGE_PROFILE,
    HANDLE_CHANGE_PROFILE,
    SET_ERROR_PROFILE
} from "../../actions/types"


const initialState = {
    values: {},
    errors: {},
    selectedPage: "Personal Information",
};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case LOAD_PROFILE: {
            return {
                ...state,
                values: payload,
            }
        }
        case SELECT_PAGE_PROFILE: {
            return {
                ...state,
                selectedPage: payload,
            }
        }
        case SET_ERROR_PROFILE: {
            return {
                ...state,
                errors: { ...state.errors, [payload.key]: payload.value },
            }
        }
        case HANDLE_CHANGE_PROFILE: {
            return {
                ...state,
                values: { ...state.values, [payload.key]: payload.value },
            }
        }
        case CLEAN_PROFILE: {
            return {
                ...state,
                values: undefined,
                errors: undefined,
            }
        }
        default:
            return {
                ...state,
            }
    }
};
