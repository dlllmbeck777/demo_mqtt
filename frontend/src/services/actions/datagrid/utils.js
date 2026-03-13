import DatagridService from "../../api/datagrid"
import { CLEAN_AFTER_SAVE_DATAGRID, CLEAN_DATAGRID_VALUES } from "../types"
import { add_error } from "../error"
export const checkMandatoryFields = (rows, type) => {
    var returnVal = true
    Promise.all(
        rows.map(async row => {
            type.map(async typeRow => {
                if (typeRow?.MANDATORY === "True") {
                    if (row?.[typeRow.COLUMN_NAME] === "") {
                        returnVal = false

                    }
                }
            })
        })
    )
    return returnVal
}

export const helperCreate = (PROP_TBL_NAME, CREATE = [], UPDATE = [], DELETE = [], CULTURE) => async (dispatch) => {
    try {
        let res = await DatagridService.create({
            PROP_TBL_NAME,
            CREATE,
            UPDATE,
            DELETE,
            CULTURE
        })
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        Promise.resolve(res.data)
    } catch (err) {
        console.log(err);
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        return Promise.reject(err)
    }
}

export const cleanAfterSave = () => async dispatch => {
    dispatch({
        type: CLEAN_AFTER_SAVE_DATAGRID,
    })
}

export const cleanAllValues = () => async dispatch => {
    dispatch({
        type: CLEAN_DATAGRID_VALUES,
    })
}

export const helperCreateNewRow = () => (dispatch, getState) => {
    const type = getState().datagrid.type
    let returnVal = {}
    Promise.all(
        type.map(e => {
            e.PROPERTY_TYPE === "BOOL" ?
                returnVal[e.COLUMN_NAME] = false :
                returnVal[e.COLUMN_NAME] = null
        })
    )

    return returnVal
}