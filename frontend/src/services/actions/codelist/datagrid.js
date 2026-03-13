import {
    SELECT_TREEVIEW_ITEM,
} from "../types"

import history from "../../../routers/history";

import { uuidv4 } from "../../utils/uuidGenerator"

import { loadTreeviewItem, selectTreeViewItem } from "../treeview/treeview"

import CodelistService from "../../api/codeList";
import resourceList from "../../api/resourceList";
import ProfileService from "../../api/profile";
import { setRowsDatagrid, addId, addNewRow, adjustColumnWidth } from "../datagrid/rows";
import { loadingToggle } from "../datagrid/datagrid";
import { checkMandatoryFields, cleanAfterSave, helperCreate, helperCreateNewRow } from "../datagrid/utils";
import { add_error } from "../error";
const _addNewItem = (isParent) => (dispatch, getState) => {
    const culture = getState().lang.cultur
    const uuid = uuidv4()
    let newRow = dispatch(helperCreateNewRow())
    newRow.ROW_ID = uuid.replace(/-/g, "");
    newRow.CULTURE = culture;
    if (isParent) {
        newRow.LIST_TYPE = "CODE_LIST";
        newRow.id = 0;
        newRow.HIERARCHY = [
            uuid.replace(/-/g, "")
        ];
    } else {
        newRow.HIERARCHY = [
            getState().treeview.selectedItem.ROW_ID,
            uuid.replace(/-/g, "")
        ];
        newRow.id = uuid.replace(/-/g, "")
    }

    return [newRow]
}

export const addNewCodeListItemSchema = () => async (dispatch, getState) => {
    const payload = dispatch(_addNewItem(true))
    dispatch({
        type: SELECT_TREEVIEW_ITEM,
        payload: { ...payload[0], selectedIndex: -2 }
    });
    dispatch(setRowsDatagrid(payload))
    dispatch(addNewRow(payload[0]?.id))
    var pathnames = window.location.pathname.split("/").filter((x) => x);
    pathnames[2] = "new"
    var routeTo = "";
    pathnames.map(e => {
        routeTo += `/${e}`
    })
    history.push(routeTo)
}

export const refreshDataGridCodelist = () => async (dispatch, getState) => {
    const CODE = getState().treeview.selectedItem.CODE;
    const CULTURE = getState().lang.cultur;
    const body = JSON.stringify({ CODE, CULTURE });
    try {
        dispatch(loadingToggle(true))
        let res = await CodelistService.getCodelistDetail(body);
        let data = addId(res.data)
        dispatch(adjustColumnWidth(data))
        dispatch(setRowsDatagrid(data))
        dispatch(loadingToggle(false))
        res = await ProfileService.getState({ "key": "others_settings" })
        ProfileService.updateProfileSettings({ others_settings: { ...res.data?.others_settings, codelist_item: { selectedItem: CODE } } })
        return Promise.resolve(data);
    } catch (err) {
        dispatch(loadingToggle(false))
        return Promise.reject(err)
    }
}

export const saveCodeList = () => async (dispatch, getState) => {
    const createdRows = getState().datagrid.createdRows
    const updatedRows = getState().datagrid.updatedRows
    const deletedRows = getState().datagrid.deletedRows
    const layer = getState().auth.user.active_layer
    const CULTURE = getState().lang.cultur
    const rows = getState().datagrid.rows
    const type = getState().datagrid.type
    const copyRows = JSON.parse(JSON.stringify(rows));
    if ((checkMandatoryFields(rows, type))) {
        const CREATE = copyRows.filter(row => createdRows.includes(row.id)).map(e => {
            delete e.id
            delete e.HIERARCHY
            if (e.LIST_TYPE !== "CODE_LIST") {
                e.LIST_TYPE = rows.find(row => row.LIST_TYPE === "CODE_LIST")?.CODE;
            }
            return e
        })
        const UPDATE = copyRows.filter(row => updatedRows.includes(row.id)).map(e => {
            delete e.id
            delete e.HIERARCHY
            if (e.LIST_TYPE !== "CODE_LIST") {
                e.LIST_TYPE = rows.find(row => row.LIST_TYPE === "CODE_LIST")?.CODE;
            }
            return e
        })
        const DELETE = deletedRows.map(e => {
            return e.ROW_ID
        })
        await dispatch(helperCreate("CODE_LIST", CREATE, UPDATE, DELETE, CULTURE))
        dispatch(cleanAfterSave())
        dispatch(loadTreeviewItem(CodelistService.getAllTreeitem, "CODE_TEXT", () => () => { }, CULTURE))
        return true
    } else {
        const body = JSON.stringify({ CULTURE, ID: "TYPE.REACT.CODELIST.MANDATORY" })
        const res = await resourceList.getErrorMessage(layer, body)
        dispatch(add_error(res.data, 400));
        return false
    }
}

export const deleteCodeList = () => async (dispatch, getState) => {
    const ROW_ID = getState().treeview.selectedItem.ROW_ID
    const selectedIndex = getState().treeview.selectedItem.selectedIndex
    const CULTURE = getState().lang.cultur
    const body = JSON.stringify({ ROW_ID, CULTURE });
    try {
        let res = await CodelistService.remove(body);
        await dispatch(loadTreeviewItem(CodelistService.getAllTreeitem, "CODE_TEXT", () => () => { }, CULTURE))
        dispatch(selectTreeViewItem(selectedIndex, "CODE"))
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        return Promise.resolve(res.data)

    } catch (err) {
        console.log(err);
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        return Promise.reject(err)
    }
}

export const addChildCodeList = () => async (dispatch, getState) => {
    const rows = getState().datagrid.rows
    const newChild = dispatch(_addNewItem(false))
    dispatch(setRowsDatagrid([...rows, newChild[0]]))
    dispatch(addNewRow(newChild[0]?.id))
}

export const checkLastOpenItem = () => async (dispatch, getState) => {
    try {
        const tv = getState().treeview.filteredMenuItem
        var path = window.location.pathname;
        var pathSegments = path.split('/');
        var secondPathElement = pathSegments[2];
        if (secondPathElement === "code_list") {
            let res = await ProfileService.getStateWCancel({ "key": "others_settings" })
            let indis = tv.findIndex((e) => {
                return e.CODE === res.data.others_settings?.codelist_item?.selectedItem
            })
            if (indis !== -1) {
                dispatch(selectTreeViewItem(indis, "CODE", 2));
            }
        }

    } catch {

    }
}
