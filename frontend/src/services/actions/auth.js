import { cleanState } from '../reducers/registerFormReducer';
import { setLoaderFalse } from './loader';
import {
    CHANGE_PASSWORD_SUCCESS,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    GITHUB_AUTH_SUCCESS,
    GITHUB_AUTH_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    FACEBOOK_AUTH_SUCCESS,
    FACEBOOK_AUTH_FAIL,
    LOGOUT,
} from './types';
import { add_error } from './error';
import { createTreeViewCouch } from './treeview/treeview';
import history from '../../routers/history';
import Auth from "../api/auth"

const isNetworkError = (err) =>
    err?.code === "ERR_NETWORK" ||
    err?.code === "ECONNABORTED" ||
    !err?.response;

const isUnauthorizedError = (err) =>
    err?.response?.status === 401 || err?.response?.status === 403;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const loadUser = () => async dispatch => {
    if (localStorage.getItem('token')) {
        for (let attempt = 0; attempt < 2; attempt += 1) {
            try {
                const res = await Auth.get()
                dispatch({
                    type: USER_LOADED_SUCCESS,
                    payload: res.data
                });
                return true
            } catch (err) {
                if (isNetworkError(err) && attempt === 0) {
                    await sleep(750)
                    continue
                }

                if (isUnauthorizedError(err)) {
                    localStorage.removeItem('token');
                    dispatch({
                        type: USER_LOADED_FAIL
                    });
                    return false
                }

                if (isNetworkError(err)) {
                    dispatch(add_error("", 500));
                } else {
                    dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.status));
                }

                localStorage.removeItem('token');
                dispatch({
                    type: USER_LOADED_FAIL
                });
                return false
            }
        }
    } else {
        dispatch({
            type: USER_LOADED_FAIL
        });
        return false
    }
};

export const login = (email, password) => async dispatch => {
    const body = JSON.stringify({ email, password });
    try {
        const res = await Auth.login(body)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data.token
        });
        await dispatch(setLoaderFalse());
        const userLoaded = await dispatch(loadUser());
        if (userLoaded === false) {
            return false
        }
        history.push(`/`);
        return true
    } catch (err) {
        console.log(err);
        dispatch({
            type: LOGIN_FAIL
        })

        dispatch(setLoaderFalse());
        if (isNetworkError(err)) {
            dispatch(add_error("", 500));

        } else {
            dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.status));
        }
        if (err?.response?.status === 404) { //
            history.push("signup")
        }
        return false
    }
};

export const signup = (email, first_name, last_name, password, isAgree) => async dispatch => {
    const body = JSON.stringify({ email, first_name, last_name, password, isAgree });
    try {
        const res = await Auth.register(body)
        dispatch({
            type: SIGNUP_SUCCESS,
            payload: res.data.token
        });
        await dispatch(loadUser());
        dispatch(setLoaderFalse());
        dispatch(cleanState())
        dispatch(createTreeViewCouch())
        dispatch(add_error(res.data.status_message?.SHORT_LABEL, 200));
        return true
    } catch (err) {
        console.log(err);
        dispatch({
            type: SIGNUP_FAIL
        })
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.status));
        dispatch(setLoaderFalse());
        return false
    }
};

export const forget_password = (email) => async dispatch => {
    const body = JSON.stringify({ email });
    try {
        let res = await Auth.forgetPass(body)
        dispatch({
            type: CHANGE_PASSWORD_SUCCESS
        });
        dispatch(add_error(res?.data?.status_message?.SHORT_LABEL, res.status));
    } catch (err) {
        console.log(err);
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.status));
    }
};

export const forgot_password_confirm = (token, password) => async dispatch => {
    const body = JSON.stringify({ password });
    try {
        await Auth.resetNewPass(token, body)
        dispatch({
            type: PASSWORD_RESET_CONFIRM_SUCCESS
        });
    } catch (err) {
        dispatch({
            type: PASSWORD_RESET_CONFIRM_FAIL
        });
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.status));
    }
};

export const logout = () => async dispatch => {
    try {
        await Auth.logout()
        dispatch({
            type: LOGOUT
        });
        dispatch(setLoaderFalse())
    } catch (err) {
        dispatch(add_error(err.message, 500));
        dispatch(setLoaderFalse())
    }
};

export const myFacebookLogin = (accesstoken, path) => async (dispatch) => {
    try {
        const body = {
            access_token: accesstoken,
        }
        let res = await Auth.socialLogin("facebook", path, body)
        await dispatch({ type: FACEBOOK_AUTH_SUCCESS, payload: res.data.key })
        await dispatch(loadUser())
        await dispatch(setLoaderFalse())
    } catch (err) {
        dispatch({ type: FACEBOOK_AUTH_FAIL })
        dispatch(add_error(err.message, 500));
        dispatch(setLoaderFalse())
    }

};

export const myGoogleLogin = (response, path) => async (dispatch) => {
    try {
        const body = {
            access_token: response.accessToken,
        }
        let res = await Auth.socialLogin("google", path, body)
        await dispatch({ type: GOOGLE_AUTH_SUCCESS, payload: res.data.key })
        await dispatch(loadUser())
        await dispatch(setLoaderFalse())
    } catch (err) {
        dispatch({ type: GOOGLE_AUTH_FAIL })
        if (path === "register") {
            dispatch(add_error(err.message, 500));
        }
        else {
            dispatch(add_error("You must register first", 100));
        }
        dispatch(setLoaderFalse())
    }
};

export const myGithubLogin = (access_token, path) => async (dispatch) => {
    try {
        const body = {
            access_token: access_token,
        }
        let res = await Auth.socialLogin("github", path, body)
        await dispatch({ type: GITHUB_AUTH_SUCCESS, payload: res.data.key })
        await dispatch(loadUser())
        await dispatch(setLoaderFalse())
    } catch (err) {
        dispatch({ type: GITHUB_AUTH_FAIL })
        dispatch(add_error(err.message, 500));
        dispatch(setLoaderFalse())
    }
};

export const emailCheck = (email) => async dispatch => {
    try {
        const body = JSON.stringify({ email: email })
        let res = await Auth.checkMail(body)
        if (res[0])
            dispatch(add_error(res?.data?.status_message?.SHORT_LABEL, parseInt(res?.data?.status_code)));
        return [!res.data.data, res?.data?.status_message?.MOBILE_LABEL]
    } catch (err) {

        console.log(err);
        return true
    }
}
