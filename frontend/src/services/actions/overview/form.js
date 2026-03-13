import { TOGGLE_STATUS } from "../types"


import ItemService from "../../api/item"
import { uuidv4 } from "../../utils/uuidGenerator"
import { add_error } from "../error"
import { dateFormatter } from "../../utils/dateFormatter"
export const saveForm = (data) => async (dispatch, getState) => {
    try {
        const ITEM_ID = getState().collapseMenu?.selectedItem?.FROM_ITEM_ID
        const CULTURE = getState().lang?.cultur
        // const body = getState().form.data

        const formData = new FormData();
        let body = { CULTURE, ITEM_ID, ...data, ROW_ID: uuidv4().replace(/-/g, ""), PERIOD: "EVENT" }
        Object.keys(body)?.map(e => {
            formData.append(e, body?.[e])
        })
        let res = await ItemService.formSave(formData)
        dispatch(add_error(res?.data?.status_message?.SHORT_LABEL, res?.data?.status_code))
    } catch (err) {
        console.log(err);
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code))
    }
}


export const saveFormRead = (values) => async (dispatch, getState) => {
    try {
        const ITEM_ID = getState().collapseMenu?.selectedItem?.FROM_ITEM_ID
        // const body = getState().form.data
        let body = {
            OLD: {}, NEW: {
                ITEM_ID: ITEM_ID,
                PERIOD: "EVENT",
                END_DATETIME: new Date("01.01.9000").getTime(),
                ROW_ID: uuidv4().replace(/-/g, ""),
                LAST_UPDT_DATE: new Date().getTime(),
            }
        }
        Object.keys(values).map(e => {
            if (e === "OLD") {
                body.OLD = values[e]
            } else {
                body.NEW[e] = values[e]
            }
        })
        let res = await ItemService.hierarchStatusUpdate(body)
    } catch (err) {
        console.log(err);
    }
}


export const updateForm = (body) => async (dispatch, getState) => {
    try {
        delete body.update

        const formData = new FormData();
        Object.keys({ ...body })?.map(e => {
            formData.append(e, body?.[e])
        })
        let res = await ItemService.formUpdate(formData)
        dispatch(add_error(res?.data?.status_message?.SHORT_LABEL, res?.data?.status_code))
        console.log(res);
    } catch (err) {
        console.log(err);
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code))
    }
}

export const deleteForm = (DELETED_ITEM) => async (dispatch) => {
    try {
        let res = await ItemService.formDelete({ DELETED_ITEM })
        dispatch(add_error(res?.data?.status_message?.SHORT_LABEL, res?.data?.status_code))
    } catch (err) {
        console.log(err);
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code))
    }
}