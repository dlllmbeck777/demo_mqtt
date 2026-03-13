import {
    LOAD_TYPE_ROWS_ITEM,
    UPDATE_ITEM,
    ADD_COLUMN_ITEM,
    CLEAN_DATAGRID_ITEM,
    CLEAR_COLUMN_ITEM,
    DELETE_COLUMN_ITEM,
    CLEAN_ITEM_AND_ROWS,
    UPDATE_COL_ITEM,
    SET_COLUMN_ITEM
} from "../../actions/types"


const initialState = {
    columns: [],
    col: {},
    typeRows: {},
    deleted: [],
    loading: false
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_COLUMN_ITEM:
            return {
                ...state,
                column: payload
            }
        case CLEAN_ITEM_AND_ROWS:
            return {
                ...state,
                col: {},
                deleted: [],
            }
        case UPDATE_COL_ITEM:
            return {
                ...state,
                col: { ...state.col, [payload.key]: payload.value },
            }
        case DELETE_COLUMN_ITEM:
            delete state.columns[payload];
            return {
                ...state,
                columns: { ...state.columns },
                deleted: [...state.deleted, payload]
            }
        case CLEAR_COLUMN_ITEM:
            return {
                ...state,
                columns: [],
                col: {},
                deleted: []
            }
        case CLEAN_DATAGRID_ITEM:
            return {
                ...state,
                typeRows: {},
                col: {},
                deleted: []
            }
        case ADD_COLUMN_ITEM:
            return {
                ...state,
                columns: { ...state.columns, ...payload }
            }
        case LOAD_TYPE_ROWS_ITEM:
            return {
                ...state,
                typeRows: payload
            }
        case UPDATE_ITEM:
            return {
                ...state,
                ...payload
            }
        default:
            return {
                ...state,
            }
    }
};
