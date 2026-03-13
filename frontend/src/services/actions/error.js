import {
    ADD_ERROR_SUCCESS,
    CLEAN_ERROR_SUCCESS,
} from './types';

export const add_error = (errMsg, statusCode) => async dispatch => {
    dispatch({
        type: ADD_ERROR_SUCCESS,
        payload: { errMsg, statusCode }
    })
};

export const clean_error = () => async dispatch => {
    dispatch({
        type: CLEAN_ERROR_SUCCESS,
    })
};
