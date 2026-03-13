import {
    CHANGE_PASSWORD_FAIL,
    CHANGE_PASSWORD_SUCCESS
} from './actions'

import ProfileService from '../../services/profile.service'


export const updatePassword = (data) => async (dispatch) => {
    try {
        const res = await ProfileService.updatePassword(data);

        dispatch({
            type: CHANGE_PASSWORD_SUCCESS,
            payload: data,
        });

        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
};