import {
    SET_ROWS_DATAGRID,
    ADD_ROWS_DATAGRID,
    SET_SELECTED_DATAGRID_ROWS,
    DELETE_ROWS_DATAGRID
} from "../types"
import { setDatagridHeaders } from "./columns"

export const addId = (data) => {
    let updatedData = []
    Promise.all(
        data.map((e, i) => {
            updatedData.push({ ...e, id: i })
        })
    )
    return updatedData
}

function calculateWidth(type, rows) {
    let max = Math.max(
        ...Object.keys(rows).map((e) => {
            return rows[e][type]?.length === undefined ? 0 : rows[e][type]?.length;
        })
    );

    return (Number.isNaN(max) ? 150 : max * 8) < 100 ? 100 : max * 8;
}

export const adjustColumnWidth = (data) => (dispatch, getState) => {
    const columns = getState().datagrid.columns
    // const copy = JSON.parse(JSON.stringify(columns));
    const newColumn = columns.map(column => {
        return { ...column, width: calculateWidth(column.field, data) }
    })
    dispatch(setDatagridHeaders(newColumn))

}

export const setRowsDatagrid = (data) => dispatch => {
    console.log(data);
    dispatch({
        type: SET_ROWS_DATAGRID,
        payload: data
    })
}

export const addNewRow = (id) => dispatch => {
    dispatch({
        type: ADD_ROWS_DATAGRID,
        payload: id
    })
}

export const setSelectedRows = (payload) => (dispatch) => {
    dispatch({
        type: SET_SELECTED_DATAGRID_ROWS,
        payload: payload
    })
}

export const deleteRow = () => (dispatch) => {
    dispatch({
        type: DELETE_ROWS_DATAGRID,
    })
}