import {
    SET_ROW_DATAGRID_TYPE,
    SET_CHANGE_TYPE_VALUE_CELL_TAG,
    AFTER_GO_INDEX_TYPE,
    SET_PROPERTY_ROW,
    CHANGE_SELECTED_ROW_PROPERTY,
    SET_CHANGE_PROPERTY_VALUE_CELL_TAG,
    DELETE_SELECTED_ITEM_PROPERTY,
    ADD_NEW_PROPERTY,
    CLEAN_ALL_DATAGRID_TYPE
} from "../../actions/types"



const initialState = {
    rows: [],
    propertyRows: [],
    changedRows: [],
    deletedRows: [],
    selectedRows: [],
    newChildRows: [],
    anyChangesType: false,
    anyChangesProperty: false,
    refresh: false
};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case CLEAN_ALL_DATAGRID_TYPE: {
            return {
                rows: [],
                propertyRows: [],
                changedRows: [],
                deletedRows: [],
                selectedRows: [],
                newChildRows: [],
                anyChangesType: false,
                anyChangesProperty: false
            }
        }
        case ADD_NEW_PROPERTY:
            return {
                ...state,
                propertyRows: { ...state.propertyRows, ...payload },
                newChildRows: { ...state.newChildRows, ...payload },
                anyChangesProperty: true
            }
        case DELETE_SELECTED_ITEM_PROPERTY:
            return {
                ...state,
                changedRows: payload.changedNew,
                deletedRows: payload.deletedRows,
                propertyRows: payload.tempRows,
                selectedRows: [],
                anyChangesProperty: true
            }
        case SET_CHANGE_PROPERTY_VALUE_CELL_TAG:

            return {
                ...state,
                propertyRows: {
                    ...state.propertyRows, [payload.id]: {
                        ...state.propertyRows[payload.id], [payload.field]: payload.value
                    }
                },
                changedRows: [...new Set([...state.changedRows, payload.id])],
                anyChangesProperty: true
            }
        case CHANGE_SELECTED_ROW_PROPERTY:
            return {
                ...state,
                selectedRows: payload
            }
        case SET_PROPERTY_ROW:
            const propertyRows = []
            payload.map((e) => {
                propertyRows[e.ROW_ID] = e
            })
            return {
                ...state,
                propertyRows: propertyRows,
                refresh: !state.refresh

            }
        case SET_ROW_DATAGRID_TYPE:
            const rows = []
            payload.map((e) => {
                rows[e.ROW_ID] = e
            })
            return {
                ...state,
                rows: rows
            }
        case SET_CHANGE_TYPE_VALUE_CELL_TAG:
            return {
                ...state,
                rows: {
                    ...state.rows, [payload.id]: {
                        ...state.rows[payload.id], [payload.field]: payload.value
                    }
                },
                anyChangesType: true,
            }
        case AFTER_GO_INDEX_TYPE:
            return {
                ...state,
                changedRows: [],
                deletedRows: [],
                selectedRows: [],
                newChildRows: [],
                anyChangesType: false,
                anyChangesProperty: false
            }
        default:
            return {
                ...state,
            }
    }
};
