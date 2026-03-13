
import axios from "axios";
import UomService from "../../api/uom"
import { uuidv4 } from "../../utils/uuidGenerator";
import ProfileService from "../../api/profile";
import { loadTreeviewItem, selectTreeViewItem } from "../treeview/treeview";
import { add_error } from "../error";
import { loadingToggle } from "../datagrid/datagrid";
import { addId, addNewRow, adjustColumnWidth, setRowsDatagrid } from "../datagrid/rows";
import { checkMandatoryFields, cleanAfterSave, helperCreate, helperCreateNewRow } from "../datagrid/utils";
import ResourcelistService from "../../api/resourceList"
let cancelToken;
export const loadDataGrid = (QUANTITY_TYPE) => async dispatch => {
    try {
        dispatch(loadingToggle(true))
        if (cancelToken) {
            cancelToken.cancel();
        }
        cancelToken = axios.CancelToken.source();
        let res = await UomService.getUom(QUANTITY_TYPE, cancelToken)
        console.log(res.data);
        let data = addId(res.data)
        dispatch(adjustColumnWidth(data))
        dispatch(setRowsDatagrid(data))
        dispatch(loadingToggle(false))
        try {
            let res = await ProfileService.getState({ "key": "others_settings" })
            ProfileService.updateProfileSettings({ others_settings: { ...res.data?.others_settings, uom: { selectedItem: QUANTITY_TYPE } } })
        } catch (err) {
            console.log(err);
        }
    } catch {

    }
}

const _addNewItem = () => (dispatch, getState) => {
    const culture = getState().lang.cultur
    const uuid = uuidv4()
    let newRow = dispatch(helperCreateNewRow())
    newRow.ROW_ID = uuid.replace(/-/g, "");
    newRow.CULTURE = culture;
    newRow.id = uuid.replace(/-/g, "");
    return [newRow]
}
export const addUomItem = () => (dispatch, getState) => {
    const rows = getState().datagrid.rows
    const newChild = dispatch(_addNewItem())
    dispatch(setRowsDatagrid([...rows, newChild[0]]))
    dispatch(addNewRow(newChild[0]?.id))
}

export const saveUom = () => async (dispatch, getState) => {
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
            delete e.IS_BASE_UOM
            return e
        })
        const DELETE = deletedRows.map(e => {
            return e.ROW_ID
        })
        await dispatch(helperCreate("UOM", CREATE, UPDATE, DELETE, CULTURE))
        dispatch(cleanAfterSave())
        dispatch(loadTreeviewItem(UomService.getAll, "QUANTITY_TYPE", () => () => { }, CULTURE))
        return true
    } else {
        const body = JSON.stringify({ CULTURE, ID: "TYPE.REACT.CODELIST.MANDATORY" })
        const res = await ResourcelistService.getErrorMessage(layer, body)
        dispatch(add_error(res.data, 400));
        return false
    }
}

export const checkLastOpenItem = () => async (dispatch, getState) => {
    try {
        const tv = getState().treeview.filteredMenuItem
        let res = await ProfileService.getStateWCancel({ "key": "others_settings" })
        var path = window.location.pathname;
        var pathSegments = path.split('/');
        var secondPathElement = pathSegments[2];
        if (secondPathElement === "uom_editor") {
            let indis = tv.findIndex((e) => {
                return e.QUANTITY_TYPE === res.data.others_settings?.uom?.selectedItem
            })
            if (indis !== -1) {
                dispatch(selectTreeViewItem(indis, "QUANTITY_TYPE", 2));
            }
        }

    } catch {

    }
}
