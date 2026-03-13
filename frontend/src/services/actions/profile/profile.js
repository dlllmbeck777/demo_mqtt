import {
    LOAD_PROFILE,
    CLEAN_PROFILE,
    SELECT_PAGE_PROFILE,
    HANDLE_CHANGE_PROFILE,
    SET_ERROR_PROFILE,
    TOGGLE_ALARMS
} from "../types"
import Auth from "../../api/auth"
import $ from "jquery"
import ProfileService from "../../api/profile";
import { loadUser } from "../auth"
import * as yup from "yup";
import { changeTheme } from "../theme";
import { add_error } from "../error";
const validationSchema = yup.object({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup
        .string("Enter your email")
        .email("Enter a valid email")
        .required("Email is required"),
    birth_day: yup.string().nullable().notRequired(),
    birth_month: yup.string().nullable().notRequired(),
    birth_year: yup.string().nullable().notRequired(),
    phone_key: yup.string().nullable().notRequired(),
    phone_number: yup.number().typeError("That doesn't look like a phone number")
        .positive("A phone number can't start with a minus")
        .integer("A phone number can't include a decimal point"),
    designation: yup.string().nullable().notRequired(),
    twitter: yup.string().nullable().notRequired().url(),
    facebook: yup.string().nullable().notRequired().url(),
    linkedin: yup.string().nullable().notRequired().url(),
    address_01: yup.string().nullable().notRequired(),
    address_02: yup.string().nullable().notRequired(),
    country: yup.string().nullable().notRequired(),
    state: yup.string().nullable().notRequired(),
    note: yup.string().nullable().notRequired(),
});

export const loadProfile = () => async (dispatch) => {
    try {
        let res = await Auth.get()
        dispatch({
            type: LOAD_PROFILE,
            payload: res.data
        })
    } catch {
    }
}

export const updateUserInfo = (user) => async (dispatch) => {
    try {
        delete user.active_layer
        delete user.layer_name
        delete user.role
        delete user.groups
        delete user.user_permissions
        try {
            let res = await Auth.profileUpdate(user)
            dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        } catch (err) {
            dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        }
        dispatch(loadProfile())
        dispatch(loadUser())
    } catch (err) {

        console.log(err);
    }
}

export const cleanProfile = () => disppatch => {
    disppatch({
        type: CLEAN_PROFILE,

    })
}

export const changePassword = (body) => async dispatch => {

    try {
        let res = await Auth.updatePassword(body)
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
    } catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
    }
}

export const handleSubmit = () => async (dispatch, getState) => {
    const values = getState().profile.values

    try {
        await validationSchema.validate(values, {
            abortEarly: false,
            strict: false,
        });
        await dispatch(updateUserInfo(values))

    } catch (err) {
        err.inner.forEach((error) => {
            dispatch({
                type: SET_ERROR_PROFILE,
                payload: { key: error.path, value: error.message }
            })
        });
    }
}

export const handleChange = (key, value) => async dispatch => {
    dispatch({
        type: HANDLE_CHANGE_PROFILE,
        payload: { key, value }
    })
    try {
        await yup.reach(validationSchema, key).validate(value)
        dispatch({
            type: SET_ERROR_PROFILE,
            payload: { key, value: "" }
        })
    } catch (err) {
        dispatch({
            type: SET_ERROR_PROFILE,
            payload: { key, value: err.message }
        })

    }
}

export const loadSettings = () => async dispatch => {
    try {
        let res = await ProfileService.loadProfileSettings()
        dispatch({
            type: LOAD_PROFILE,
            payload: res.data[0]
        })
    } catch {

    }
}

export const cleanSettings = () => dispatch => {

}

export const handleChangeSettings = (key, value) => async dispatch => {
    dispatch({
        type: HANDLE_CHANGE_PROFILE,
        payload: { key, value }
    })
}

export const handleSubmitSettings = () => async (dispatch, getState) => {
    const values = getState().profile.values
    try {
        let res = await ProfileService.updateProfileSettings(values)
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        console.log(res);
        $(".drawer-menu__list-item__text").css({
            "font-weight": parseInt(values.font_weight),
        });
        $(".treemenu-container__box__element-box__list__item > span").css({
            "font-weight": parseInt(values.font_weight),
        });
        $(".MuiTreeItem-label").css({
            "font-weight": parseInt(values.font_weight),
        });
        $(".tag-manager-container__body__property-box__prop-item__box__label").css({
            "font-weight": parseInt(values.font_weight),
        });
        localStorage.setItem("fontweight", parseInt(values.font_weight));

        $("html").css({
            "font-size": `${parseInt(values.font_size)}px`,
        });
        localStorage.setItem("fontsize", `${parseInt(values.font_size)}`);

        $(".overview-tree-menu").hide(200);
        $(".overview-container__horizontal-menu").show(200);
        $(".overview-container__tab-box").css({ height: "calc(100% - 44px)" });
        localStorage.setItem("treemenuoverview", values.overview_orientation);

        $("#main-box").removeClass().addClass(`theme-${values.thema}`);
        localStorage.setItem("theme", `theme-${values.thema}`);
        dispatch(changeTheme(values.thema));
        dispatch({
            type: TOGGLE_ALARMS,
            payload: values.alarm_notification
        })
    } catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
    }
}

export const selectPage = (page) => dispatch => {
    dispatch({
        type: SELECT_PAGE_PROFILE,
        payload: page
    })
}

