import {
    CLEAN_FEEDBACK,
    HANDLE_CHANGE_FEEDBACK,
    SET_ERROR_FEEDBACK
} from "../types"

import * as yup from "yup";
import { uuidv4 } from "../../utils/uuidGenerator";
import FeedbackService from "../../api/feedback";
const validationSchema = yup.object({
    NAME: yup.string().required("First name is required"),
    COMPANY_NAME: yup.string(),
    EMAIL: yup
        .string("Enter your email")
        .email("Enter a valid email")
        .required("Email is required"),
    PHONE_NUMBER: yup.number().typeError("That doesn't look like a phone number")
        .positive("A phone number can't start with a minus")
        .integer("A phone number can't include a decimal point"),
    MESSAGE: yup.string().nullable().notRequired(),
});

export const addFeedback = async (feedback) => {
    try {
        let res = await FeedbackService.create({ ...feedback, ROW_ID: uuidv4().replace(/-/g, "") })
        return Promise.resolve(res)
    } catch (err) {
        console.log(err);
        return Promise.reject(err)
    }
}

export const cleanFeedback = () => disppatch => {
    disppatch({
        type: CLEAN_FEEDBACK,
    })
}


export const handleSubmit = () => async (dispatch, getState) => {
    const values = getState().feedback.values

    try {
        await validationSchema.validate(values, {
            abortEarly: false,
            strict: false,
        });
        addFeedback(values)
        dispatch(cleanFeedback())

    } catch (err) {
        err.inner.forEach((error) => {
            dispatch({
                type: SET_ERROR_FEEDBACK,
                payload: { key: error.path, value: error.message }
            })
        });
    }
}

export const handleChange = (key, value) => async dispatch => {
    dispatch({
        type: HANDLE_CHANGE_FEEDBACK,
        payload: { key, value }
    })
    try {
        await yup.reach(validationSchema, key).validate(value)
        dispatch({
            type: SET_ERROR_FEEDBACK,
            payload: { key, value: "" }
        })
    } catch (err) {
        dispatch({
            type: SET_ERROR_FEEDBACK,
            payload: { key, value: err.message }
        })

    }
}
