import {
    SET_IS_ACTIVE_CONFIRMATION,
    SET_SAVE_FUNCTION_CONFIRMATION,
    SET_BODY_CONFIRMATION,
    SET_TITLE_CONFIRMATION,
    SET_GO_FUNCTION_CONFIRMATION,
    SET_IS_OPEN_CONFIRMATION,
    SET_CLEAN_CONFIRMATION
} from "../types"


export const setIsActiveConfirmation = (payload) => dispatch => {
    dispatch({
        type: SET_IS_ACTIVE_CONFIRMATION,
        payload: payload
    })
}


export const setSaveFunctonConfirmation = (payload) => dispatch => {
    dispatch({
        type: SET_SAVE_FUNCTION_CONFIRMATION,
        payload: payload
    })
}



export const setBodyConfirmation = (payload) => dispatch => {
    dispatch({
        type: SET_BODY_CONFIRMATION,
        payload: payload
    })
}



export const setTitleConfirmation = (payload) => dispatch => {
    dispatch({
        type: SET_TITLE_CONFIRMATION,
        payload: payload
    })
}



export const setGoFunctionConfirmation = (payload) => dispatch => {
    dispatch({
        type: SET_GO_FUNCTION_CONFIRMATION,
        payload: payload
    })
}



export const setIsOpenConfirmation = (payload) => dispatch => {
    dispatch({
        type: SET_IS_OPEN_CONFIRMATION,
        payload: payload
    })
}


export const setCleanConfirmation = () => dispatch => {
    dispatch({
        type: SET_CLEAN_CONFIRMATION,
    })
}



