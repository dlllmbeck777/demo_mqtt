import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAIL,
    SET_MESSAGE
} from "./actions";

import AuthService from '../../services/auth.service';
import { Navigate } from "react-router-dom";

export const register = (first_name, last_name, email, password) => (dispatch) => {
    return AuthService.register(first_name, last_name, email, password).then(
        (response) => {
            dispatch({
                type: REGISTER_SUCCESS,
            });


            return Promise.resolve();
        },
        (error) => {


            dispatch({
                type: REGISTER_FAIL,
            });



            return Promise.reject();
        }
    );
};

export const login = (email, password) => (dispatch) => {
    return AuthService.login(email, password).then(
        (data) => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: { user: data },
            });

            return Promise.resolve();
        },
        (error) => {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            dispatch({
                type: LOGIN_FAIL,
            });

            dispatch({
                type: SET_MESSAGE,
                payload: message,
            });

            return Promise.reject();
        }
    );
};

export const logout = () => (dispatch) => {
    AuthService.logout();
    <Navigate to="/" />
    dispatch({
        type: LOGOUT,
    });
};

export const changePassword = (old_password, new_password1, new_password2) => (dispatch) => {
    AuthService.changePassword.patch(old_password, new_password1, new_password2).then(
        (data) => {
            dispatch({
                type: CHANGE_PASSWORD_SUCCESS,
                payload: data,
            })

            return Promise.resolve()
        },
        (error) => {


            dispatch({
                type: CHANGE_PASSWORD_FAIL,
            });



            return Promise.reject();
        })


}
