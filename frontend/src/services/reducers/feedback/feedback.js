import {
    CLEAN_FEEDBACK,
    HANDLE_CHANGE_FEEDBACK,
    SET_ERROR_FEEDBACK
} from "../../actions/types"


const initialState = {
    values: {},
    errors: {},
};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {

        case SET_ERROR_FEEDBACK: {
            return {
                ...state,
                errors: { ...state.errors, [payload.key]: payload.value },
            }
        }
        case HANDLE_CHANGE_FEEDBACK: {
            return {
                ...state,
                values: { ...state.values, [payload.key]: payload.value },
            }
        }
        case CLEAN_FEEDBACK: {
            return {
                ...state,
                values: {
                    EMAIL: "", NAME: ""
                    , PHONE_NUMBER: "", COMPANY_NAME: "", MESSAGE: ""
                },
                errors: {},
            }
        }
        default:
            return {
                ...state,
            }
    }
};
