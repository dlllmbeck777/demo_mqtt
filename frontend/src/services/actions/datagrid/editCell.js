import {
    EDIT_CELL_DATAGRID,
    UPDATE_ROWS_DATAGRID,
    SET_IS_ACTIVE_CONFIRMATION
} from "../types"

const isNewCell = (id) => (dispatch, getState) => {
    const createdRows = getState().datagrid.createdRows
    return createdRows.includes(id)
}

const isUdatedCell = (id) => (dispatch, getState) => {
    const updatedRows = getState().datagrid.updatedRows
    return updatedRows.includes(id)
}

export const handleChangeDatagridCell = (id, field, value) => async dispatch => {
    dispatch(handleChangeEditCell(id, field, value))
    dispatch({
        type: SET_IS_ACTIVE_CONFIRMATION,
        payload: true
    })
    if (!dispatch(isNewCell(id)) && !dispatch(isUdatedCell(id))) {
        dispatch({
            type: UPDATE_ROWS_DATAGRID,
            payload: id
        })
    }
}

export const handleChangeEditCell = (id, field, value) => async dispatch => {
    dispatch({
        type: EDIT_CELL_DATAGRID,
        payload: { id, field, value }
    })
}


