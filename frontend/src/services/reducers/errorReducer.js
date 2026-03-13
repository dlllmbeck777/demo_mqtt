import {
    ADD_ERROR_SUCCESS,
    ADD_ERROR_FAIL,
    CLEAN_ERROR_SUCCESS,
    CLEAN_ERROR_FAIL,
} from '../actions/types';

const initialState = {
    errMsg: "",
    isError: false,
    statusCode: 200
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case ADD_ERROR_SUCCESS:
            return {
                ...state,
                errMsg: payload.errMsg,
                statusCode: payload.statusCode,
                isError: true
            }
        case CLEAN_ERROR_SUCCESS:
        case ADD_ERROR_FAIL:
            return {
                ...state,
                errMsg: "",
                isError: false,
                statusCode: 200
            }
        case CLEAN_ERROR_FAIL:
            return {
                ...state
            }
        default:
            return state
    }
};
