import React from "react";
import {
    LOAD_TYPE_ROWS_ITEM,
    ADD_COLUMN_ITEM,
    CLEAN_DATAGRID_ITEM,
    SET_IS_ACTIVE_CONFIRMATION,
    DELETE_COLUMN_ITEM,
    CLEAN_ITEM_AND_ROWS,
    UPDATE_COL_ITEM,
    CLEAR_COLUMN_ITEM,
} from "../types"
import axios from "axios";
import ItemService from "../../api/item"
import { uuidv4 } from "../../utils/uuidGenerator";
import { loadTreeviewItem, selectTreeViewItem, selectTreeItemAfterSave } from "../treeview/treeview"
import { add_error } from "../error";
import resourceList from "../../api/resourceList";
import ProfileService from "../../api/profile";
import TextFieldCompiler from "../../../components/datagrid/typeCompiler/fieldCompiler";
import RenderCellComiler from '../../../components/datagrid/renderCell/renderCellCompiler';
import { setDatagridColumns } from "../datagrid/columns";
import { adjustColumnWidth, setRowsDatagrid } from "../datagrid/rows";
import { handleChangeEditCell } from "../datagrid/editCell";
import { dynamicUpdateDatagrid } from "../datagrid/datagrid";
const typeFinder = {
    "BOOL": "PROPERTY_STRING",
    "TEXT": "PROPERTY_STRING",
    "NUMBER": "PROPERTY_VALUE",
    "INT": "PROPERTY_VALUE",
    "CODE": "PROPERTY_STRING",
    "BLOB_ID": "PROPERTY_BINARY",
    "DATE": "PROPERTY_DATE"
}

export class column {
    constructor(props) {
        this.field = props.columnId.toString();
        this.headerName = "";
        this.width = 150;
        this.filterable = false;
        this.sortable = false;
        this.editable = props.editable;
        this.renderCell = (params) => {
            return <RenderCellComiler
                prop_type={params?.row?.PROPERTY_TYPE}
                id={params?.id}
                field={params?.field}
                mandatory={params?.row?.MANDATORY}
                useDatagridValue={true}
            />
        };
        this.renderEditCell = (params) => {
            return <TextFieldCompiler
                id={params?.id}
                field={params?.field}
                code_list={params?.row?.CODE_LIST}
                prop_type={params?.row?.PROPERTY_TYPE}
                mandatory={params?.row?.MANDATORY}
                useDatagridValue={true}
                type={props.type}
            />
        };
        this.cellClassName = `myRenderCell ${!props.editable && "readOnlyColumn"}`
    }
}

const _createColumn = (columnId, editable, type = "") => (dispatch, getState) => {
    dispatch({
        type: ADD_COLUMN_ITEM,
        payload: { [columnId]: new column({ columnId: columnId, editable, type }) }
    })
    if (editable)
        dispatch({
            type: UPDATE_COL_ITEM,
            payload: { key: columnId, value: true }
        })
}

let cancelToken;
export const loadTypeRowsDataGrid = () => async (dispatch, getState) => {
    const TYPE = getState().drawerMenu.selectedItem.TYPE
    const CULTURE = getState().lang.cultur
    try {
        const body = JSON.stringify({ TYPE, CULTURE })
        if (cancelToken) {
            cancelToken.cancel()
        }
        cancelToken = axios.CancelToken.source();
        let res = await ItemService.getTypeProperty(body, cancelToken)
        console.log(res);
        var response = []
        response.push({
            PROPERTY_NAME: "",
            COLUMN_NAME: "PROPERTY_DATE",
            CODE_LIST: null,
            MANDATORY: "True",
            LABEL_ID: "HISTORY",
            PROP_GRP: "",
            PROPERTY_TYPE: "HISTORY",
            SORT_ORDER: "1",
            id: 0,
            SHORT_LABEL: "",
            "UNICODE": "False"
        });
        let i = 0
        Object.keys(res.data).map((e) => {
            res.data[e].map((a) => {
                i++;
                response.push({ ...a, id: i })
            })
        })
        dispatch(adjustColumnWidth(response))
        dispatch(setRowsDatagrid(response))
        dispatch({
            type: LOAD_TYPE_ROWS_ITEM,
            payload: response
        })
        dispatch(loadItemRowsDataGrid())

        return Promise.resolve(res.data)
    } catch (err) {
        return Promise.reject(err)
    }
}

export const cleanColumns = () => async (dispatch, getState) => {
    dispatch({ type: CLEAR_COLUMN_ITEM })
}

export const loadColumns = () => async (dispatch, getState) => {
    const CULTURE = getState().lang.cultur
    dispatch(setDatagridColumns(CULTURE, "ITEM"))
    return Promise.resolve(true)
}

let itemCancelToken;
export const loadItemRowsDataGrid = () => async (dispatch, getState) => {
    const ITEM_ID = getState().treeview.selectedItem?.ITEM_ID
    const ITEM_TYPE = getState().drawerMenu.selectedItem.TYPE
    const rows = getState().datagrid.rows
    if (ITEM_ID) {
        try {
            const body = JSON.stringify({ ITEM_ID })
            if (itemCancelToken) {
                itemCancelToken.cancel()
            }
            itemCancelToken = axios.CancelToken.source();
            let res = await ItemService.getItemValues(body, itemCancelToken)
            if (rows.length > 0) {
                Promise.all(
                    Object.keys(res.data).map(e => {
                        dispatch(_createColumn(e, false))

                        Promise.all(
                            res.data[e].map(prop => {
                                let row = rows.find(row => row.PROPERTY_NAME === prop.PROPERTY_TYPE)
                                dispatch(handleChangeEditCell(row.id, e, prop[row.COLUMN_NAME]))
                            })
                        )
                        dispatch(handleChangeEditCell(0, e, parseInt(e)))
                    })
                )
            }
            try {
                let res = await ProfileService.getState({ "key": "others_settings" })
                ProfileService.updateProfileSettings({ others_settings: { ...res.data?.others_settings, [ITEM_TYPE]: { selectedItem: ITEM_ID } } })
            } catch (err) {
                console.log(err);
            }
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

export const cleanDataGrid = () => dispatch => {
    dispatch({
        type: CLEAN_DATAGRID_ITEM
    })
}

export const checkMandatoryFields = () => (dispatch, getState) => {
    const rows = getState().datagrid.rows
    var returnValue = true
    rows.map((e) => {
        if (e.MANDATORY === "True") {
            Object.keys(getState().itemDataGrid.columns).map(async (a, i) => {
                if (e[a] === "") {
                    returnValue = false
                }
            })
        }
    })
    return returnValue
}

const saveSupport = (rows, a) => {
    const typeSaveFinder = {
        "BOOL": rows[a] ? "True" : "False",
        "TEXT": rows[a],
        "NUMBER": parseInt(rows[a]),
        "INT": parseInt(rows[a]),
        "CODE": rows[a],
        "BLOB_ID": rows[a],
        "DATE": rows[a] === "" ? "" : rows[a],
        "NULL": rows[a]
    }
    return {
        "PROPERTY_TYPE": rows.PROPERTY_NAME,
        "PROPERTY_INFO": rows.PROPERTY_TYPE,
        // "ROW_ID": rows[`${a}ID`] ? rows[`${a}ID`] : propsRowUuid.replace(/-/g, ""),
        "START_DATETIME": a,
        [typeFinder[rows.PROPERTY_TYPE]]: typeSaveFinder[rows.PROPERTY_TYPE],
        "UNICODE": rows.UNICODE
    }
}

export const saveItem = () => async (dispatch, getState) => {
    const type = getState().drawerMenu.selectedItem.TYPE
    const row = getState().datagrid.rows
    const col = getState().itemDataGrid.col
    const DELETED = getState().itemDataGrid.deleted
    const layer = getState().auth.user.active_layer
    const CULTURE = getState().lang.cultur
    if (dispatch(checkMandatoryFields())) {
        let PROPERTYS = []
        Promise.all(
            Object.keys(col).map(e => {
                row.map(a => {
                    if (!col[e]) { }
                    else if (a[e] !== "" && a.PROPERTY_TYPE !== "HISTORY")
                        PROPERTYS.push(saveSupport(a, e))
                })
            })
        )
        let ITEM = {
            "ITEM_ID": getState().treeview.selectedItem.ITEM_ID ? getState().treeview.selectedItem.ITEM_ID : uuidv4().replace(/-/g, ""),
            "ITEM_TYPE": type,
            "ROW_ID": getState().treeview.selectedItem.ROW_ID ? getState().treeview.selectedItem.ROW_ID : uuidv4().replace(/-/g, ""),
            "LAYER_NAME": layer
        }
        const body = JSON.stringify({ ITEM, PROPERTYS, CULTURE });
        const deleteBody = JSON.stringify({ ITEM, DELETED, CULTURE });
        try {
            let res;
            try {
                res = await ItemService.create(body)
                dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
                if (DELETED.length > 0) {
                    res = await ItemService.removeColumns(deleteBody)
                    dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
                }
            } catch (err) {
                dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
            }
            await dispatch(loadTreeviewItem(async (body, cancelToken) => {
                return await ItemService.getAll(body, cancelToken, type);
            }, "PROPERTY_STRING", () => () => { }, CULTURE))
            dispatch(selectTreeItemAfterSave(
                "PROPERTY_STRING",
                3,
                PROPERTYS.filter(e => e.PROPERTY_TYPE === "NAME")[0].PROPERTY_STRING),
            )
            return res
        } catch (err) {
            console.log(err);
            // dispatch(add_error(err.response.data.Message, 400));
            return err
        }
    }
    else {
        const body = JSON.stringify({ CULTURE, ID: "TYPE.REACT.ITEM.MANDATORY" })
        const res = await resourceList.getErrorMessage(layer, body)
        console.log(res);
        dispatch(add_error(res.data, 400));
    }
}

const fillCreatedRows = () => (dispatch, getState) => {
    var rows = getState().datagrid.rows
    const list = []
    Promise.all(
        rows.map(e => {
            list.push(e.id)
        })
    )
    dispatch(
        dynamicUpdateDatagrid(
            { createdRows: list }
        )
    )
}
export const addNewColumn = (columnId) => (dispatch, getState) => {
    console.log(columnId);
    var rows = getState().datagrid.rows
    var type = getState().drawerMenu.selectedItem.TYPE
    Promise.all(
        rows.map(a => {
            if (a.PROPERTY_TYPE === "HISTORY") {
                a[columnId] = columnId
            }
            else if (a.PROPERTY_TYPE !== "BOOL") {
                a[columnId] = ""
            }
            else {
                a[columnId] = false
            }
        })
    )
    dispatch(_createColumn(columnId, true, type))
    dispatch(fillCreatedRows())
}

export const deleteItem = () => async (dispatch, getState) => {
    const ITEM_ID = getState().treeview.selectedItem.ITEM_ID
    const selectedIndex = getState().treeview.selectedItem.selectedIndex
    const type = getState().drawerMenu.selectedItem.TYPE
    const CULTURE = getState().lang.cultur
    const body = JSON.stringify({ ITEM_ID, CULTURE });
    try {
        try {
            let res = await ItemService.remove(body)
            dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        } catch (err) {
            dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        }
        await dispatch(loadTreeviewItem(async (body, cancelToken) => {
            return await ItemService.getAll(body, cancelToken, type);
        }, "PROPERTY_STRING", () => () => { }, CULTURE))
        dispatch(selectTreeViewItem(selectedIndex, "PROPERTY_STRING"));
    }
    catch (err) {
    }
}

export const deleteColum = (field) => (dispatch) => {
    dispatch({
        type: DELETE_COLUMN_ITEM,
        payload: field
    });
    dispatch({
        type: SET_IS_ACTIVE_CONFIRMATION,
        payload: true
    })
};

export const cleanDataGridItemAndRows = () => dispatch => {
    dispatch({
        type: CLEAN_ITEM_AND_ROWS
    })
}

export const checkLastOpenItem = () => async (dispatch, getState) => {
    try {
        const type = getState().drawerMenu.selectedItem?.TYPE
        const tv = getState().treeview.filteredMenuItem
        let res = await ProfileService.getStateWCancel({ "key": "others_settings" })

        let indis = tv.findIndex((e) => {
            return e.ITEM_ID === res.data.others_settings?.[type]?.selectedItem
        })
        if (indis !== -1) {
            dispatch(selectTreeViewItem(indis, "PROPERTY_STRING", 3));
        }
    } catch {

    }
}

