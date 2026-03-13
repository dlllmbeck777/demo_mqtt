import {
    SELECT_TREEVIEW_ITEM,
} from "../types"

import history from "../../../routers/history";
import { add_error } from "../error";
import { uuidv4 } from "../../utils/uuidGenerator"
import { loadTreeviewItem, selectTreeViewItem } from "../treeview/treeview"
import ResourcelistService from "../../api/resourceList";
import ProfileService from "../../api/profile";
import { checkMandatoryFields, cleanAfterSave, cleanAllValues, helperCreate, helperCreateNewRow } from "../datagrid/utils";
import { addId, addNewRow, adjustColumnWidth, setRowsDatagrid } from "../datagrid/rows";
import { loadingToggle } from "../datagrid/datagrid";
const _createNewParent = () => (dispatch, getState) => {
    const culture = getState().lang.cultur
    const uuid = uuidv4()
    let newRow = dispatch(helperCreateNewRow())
    newRow.id = uuid.replace(/-/g, "");
    newRow.ROW_ID = uuid.replace(/-/g, "");
    newRow.CULTURE = culture;
    return [newRow]
}

export const addRowResource = () => async (dispatch, getState) => {
    const rows = getState().datagrid.rows
    const payload = dispatch(_createNewParent())
    dispatch(setRowsDatagrid([...rows, payload[0]]))
    dispatch(addNewRow(payload[0]?.id))
}
export const addRowResourceNew = () => async (dispatch, getState) => {
    const payload = dispatch(_createNewParent())
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

export const refreshDataGridResourcelist = () => async (dispatch, getState) => {
    const PARENT = getState().treeview.selectedItem.PARENT
    const CULTURE = getState().lang.cultur
    const body = JSON.stringify({
        CULTURE, PARENT
    });

    try {
        dispatch(cleanAllValues());
        dispatch(loadingToggle(true))
        let res = await ResourcelistService.getResourcelistDetail(body);
        let data = addId(res.data)
        dispatch(adjustColumnWidth(data))
        dispatch(setRowsDatagrid(data))
        dispatch(loadingToggle(false))
        try {
            let res = await ProfileService.getState({ "key": "others_settings" })
            ProfileService.updateProfileSettings({ others_settings: { ...res.data?.others_settings, resource: { selectedItem: PARENT } } })
        } catch (err) {
            console.log(err);
        }
        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err)
    }
}

export const saveResourceList = () => async (dispatch, getState) => {
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
            return e
        })
        const UPDATE = copyRows.filter(row => updatedRows.includes(row.id)).map(e => {
            delete e.id
            return e
        })
        const DELETE = deletedRows.map(e => {
            return e.ROW_ID
        })
        await dispatch(helperCreate("RESOURCE_LIST", CREATE, UPDATE, DELETE, CULTURE))
        dispatch(cleanAfterSave())
        dispatch(loadTreeviewItem(ResourcelistService.getAllTreeitem, "SHORT_LABEL", () => () => { }, CULTURE))
        return true
    } else {
        const body = JSON.stringify({ CULTURE, ID: "TYPE.REACT.CODELIST.MANDATORY" })
        const res = await ResourcelistService.getErrorMessage(layer, body)
        dispatch(add_error(res.data, 400));
        return false
    }
}

export const deleteResourceList = () => async (dispatch, getState) => {
    const PARENT = getState().treeview.selectedItem.PARENT
    const selectedIndex = getState().treeview.selectedItem.selectedIndex
    const CULTURE = getState().lang.cultur
    const body = JSON.stringify({ PARENT });
    try {
        let res = await ResourcelistService.remove(body);
        console.log(res);
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        await dispatch(loadTreeviewItem(ResourcelistService.getAllTreeitem, "SHORT_LABEL", () => () => { }, CULTURE))
        dispatch(selectTreeViewItem(selectedIndex, "ID"))
        return Promise.resolve(res.data)
    } catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        return Promise.reject(err)
    }
}

export const saveAndMoveResourceList = (index) => async (dispatch, getState) => {
    if (index < 0) {
        index = getState().item.treeview.filteredMenuItem.length - 1
    }
    else if (index > getState().item.filteredMenuItem.length - 1) {
        index = 0
    }
    dispatch(saveResourceList())
    dispatch(selectTreeViewItem(index));
}

export const checkLastOpenItem = () => async (dispatch, getState) => {
    try {
        const tv = getState().treeview.filteredMenuItem
        let res = await ProfileService.getStateWCancel({ "key": "others_settings" })
        var path = window.location.pathname;
        var pathSegments = path.split('/');
        var secondPathElement = pathSegments[2];
        if (secondPathElement === "resources") {
            let indis = tv.findIndex((e) => {
                return e.PARENT === res.data.others_settings?.resource?.selectedItem
            })
            if (indis !== -1) {
                dispatch(selectTreeViewItem(indis, "PARENT", 2));
            }
        }

    } catch {

    }
}
