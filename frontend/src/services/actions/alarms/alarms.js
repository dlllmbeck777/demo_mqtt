import {
    TOGGLE_ALARMS,

} from '../types';
export const openAlarms = () => dispatch => {
    dispatch({
        type: TOGGLE_ALARMS,
        payload: true
    })
}


export const closeAlarms = () => dispatch => {
    dispatch({
        type: TOGGLE_ALARMS,
        payload: false
    })
}