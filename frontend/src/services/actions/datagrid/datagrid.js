import { CLEAN_DATAGRID, DYNAMIC_UPDATE_DATAGRID } from "../types"


export const cleanDatagrid = () => dispatch => {
    dispatch({
        type: CLEAN_DATAGRID
    })
}

export const loadingToggle = (payload) => dispatch => {
    dispatch(dynamicUpdateDatagrid(
        { loading: payload }
    ))
}

export const dynamicUpdateDatagrid = (payload) => dispatch => {
    dispatch({
        type: DYNAMIC_UPDATE_DATAGRID,
        payload
    })
}