import {
    SET_COLUMNS_DATAGRID,
    SET_ROWS_DATAGRID,
    CLEAN_DATAGRID_VALUES,
    ADD_ROWS_DATAGRID,
    EDIT_CELL_DATAGRID,
    UPDATE_ROWS_DATAGRID,
    DELETE_ROWS_DATAGRID,
    DYNAMIC_UPDATE_DATAGRID,
    SET_DATAGRID_TYPE,
    CLEAN_DATAGRID,
    CLEAN_AFTER_SAVE_DATAGRID,
    SET_SELECTED_DATAGRID_ROWS,
} from "../../actions/types"


const initialState = {
    columns: [],
    rows: [],
    selectedRows: [],
    createdRows: [],
    updatedRows: [],
    deletedRows: [],
    type: [],
    loading: false,
    selectedRows: [],
    refresh: false
};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case DELETE_ROWS_DATAGRID: {
            return {
                ...state,
                rows: state.rows.filter(row => !state.selectedRows.includes(row.id)),
                createdRows: state.createdRows.filter(id => !state.selectedRows.includes(id)),
                updatedRows: state.updatedRows.filter(id => !state.selectedRows.includes(id)),
                deletedRows: state.rows.filter(row => state.selectedRows.includes(row.id)),
                selectedRows: [],
            }
        }
        case SET_SELECTED_DATAGRID_ROWS: {
            return {
                ...state,
                selectedRows: payload,
            }
        }
        case ADD_ROWS_DATAGRID: {
            return {
                ...state,
                createdRows: [...state.createdRows, payload],
            }
        }
        case SET_COLUMNS_DATAGRID: {
            return {
                ...state,
                columns: payload,
                refresh: !state.refresh
            }
        }
        case SET_ROWS_DATAGRID: {
            return {
                ...state,
                rows: payload,
                refresh: !state.refresh
            }
        }
        case EDIT_CELL_DATAGRID: {
            return {
                ...state,
                rows: [...state.rows.map(e => {
                    if (e?.id === payload.id) {
                        e[payload.field] = payload.value
                    }
                    return e
                })]
            }
        }
        case UPDATE_ROWS_DATAGRID: {
            return {
                ...state,
                updatedRows: [...state.updatedRows, payload]
            }
        }
        case DYNAMIC_UPDATE_DATAGRID: {
            return {
                ...state,
                ...payload
            }
        }
        case SET_DATAGRID_TYPE: {
            return {
                ...state,
                type: payload
            }
        }
        case CLEAN_DATAGRID: {
            return {
                columns: [],
                rows: [],
                selectedRows: [],
                createdRows: [],
                updatedRows: [],
                deletedRows: [],
                type: [],
                loading: false,
                refresh: false
            }
        }
        case CLEAN_DATAGRID_VALUES: {
            return {
                ...state,
                rows: [],
                selectedRows: [],
                createdRows: [],
                updatedRows: [],
                deletedRows: [],
                loading: false
            }
        }
        case CLEAN_AFTER_SAVE_DATAGRID: {
            return {
                ...state,
                selectedRows: [],
                createdRows: [],
                updatedRows: [],
                deletedRows: [],
            }
        }
        default:
            return {
                ...state,
            }
    }
};
