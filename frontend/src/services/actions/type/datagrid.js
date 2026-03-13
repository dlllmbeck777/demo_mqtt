import { uuidv4 } from "../../utils/uuidGenerator"
import axios from "axios";
import {
    SET_ROW_DATAGRID_TYPE,
    SET_CHANGE_TYPE_VALUE_CELL_TAG,
    SET_PROPERTY_ROW,
    CHANGE_SELECTED_ROW_PROPERTY,
    SET_CHANGE_PROPERTY_VALUE_CELL_TAG,
    DELETE_SELECTED_ITEM_PROPERTY,
    ADD_NEW_PROPERTY,
    AFTER_GO_INDEX_TYPE,
    SELECT_TREEVIEW_ITEM,
    CLEAN_ALL_DATAGRID_TYPE,
    SET_IS_ACTIVE_CONFIRMATION
} from "../types"

import {
    setConfirmation,
} from "../../reducers/confirmation";

import { loadTreeviewItem, selectTreeItemAfterSave, selectTreeViewItem } from "../treeview/treeview"
import { add_error } from "../error";
import TypeService from "../../api/type"
import ProfileService from "../../api/profile";
import ResourcelistService from "../../api/resourceList"
import { loadDrawerMenu } from "../drawerMenu/drawerMenu";

const _createNewType = () => {
    const uuid = uuidv4()
    return [
        {
            "ROW_ID": uuid.replace(/-/g, ""),
            "TYPE": "",
            "TYPE_CLASS": "",
            "LABEL_ID": "",
            "CHANGE_INTERVAL": "",
            "LAYER_NAME": "",
            "HIDDEN": "",
            "BASE_TYPE": "",
            "CODE_LIST_TYPE": "",
            "IS_QUICK_LINK": "",
            "PROP_TBL_NAME": "",
            "BASE_TBL_NAME": "",
            "TAG_TBL_NAME": "",
            "LAST_UPDT_USER": "",
            "LAST_UPDT_DATE": "",
            "HIERARCHY": [
                uuid.replace(/-/g, "")
            ]
        }
    ]
}

const _createNewProperty = (type) => {
    const uuid = uuidv4()
    return {
        "TYPE": type,
        "PROPERTY_NAME": "",
        "CODE_LIST": "",
        "MANDATORY": "",
        "LABEL_ID": "",
        "PROP_GRP": "",
        "PROPERTY_TYPE": "",
        "SORT_ORDER": "",
        "ROW_ID": uuid.replace(/-/g, ""),
    }
}

export const addNewType = () => dispatch => {
    const newType = _createNewType()
    dispatch({
        type: SET_ROW_DATAGRID_TYPE,
        payload: newType
    })
    dispatch({
        type: SET_PROPERTY_ROW,
        payload: []
    })
    dispatch({
        type: SELECT_TREEVIEW_ITEM,
        payload: { ...newType[0], selectedIndex: -2 }
    });
}

export const checkmandatoryFields = () => {//todo fill the function
    return true
}

export const onChangeCell = (id, field, value, dispatchIndex) => dispatch => {
    const dispatchType = [SET_CHANGE_TYPE_VALUE_CELL_TAG, SET_CHANGE_PROPERTY_VALUE_CELL_TAG]
    dispatch({
        type: dispatchType[dispatchIndex],
        payload: { id: id, field: field, value: value }
    })
    dispatch({
        type: SET_IS_ACTIVE_CONFIRMATION,
        payload: true
    })
}

export const fillPropertyTable = (TYPE) => async (dispatch, getState) => {
    const CULTURE = getState().lang.lang
    const body = JSON.stringify({ TYPE, CULTURE })
    try {
        let res = await TypeService.getTypeAndProperty(body);
        res.data.shift()
        dispatch({
            type: SET_PROPERTY_ROW,
            payload: res.data
        })
        try {
            let res = await ProfileService.getState({ "key": "others_settings" })
            ProfileService.updateProfileSettings({ others_settings: { ...res.data?.others_settings, type: { selectedItem: TYPE } } })
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        // dispatch({
        //     type: CLEAN_ALL_DATAGRID_TYPE
        // })
    }
}

export const setSelectedRows = rowId => dispatch => {
    dispatch({
        type: CHANGE_SELECTED_ROW_PROPERTY,
        payload: rowId
    })
}

export const deleteProperty = () => (dispatch, getState) => {
    const newChildRows = getState().dataGridType.newChildRows;
    const selectedRows = getState().dataGridType.selectedRows;
    const changedRows = getState().dataGridType.changedRows;
    var deletedRows = getState().dataGridType.deletedRows;
    const rows = getState().dataGridType.propertyRows;
    var changedNew = []
    var tempRows = []
    Object.keys(rows).map(e => {
        var temp = true
        selectedRows.map((a) => {
            if (e === a) {
                temp = false
            }
        })
        if (temp) {
            tempRows[e] = rows[e]
        }
    })

    changedRows.map((e, i) => {
        var temp = true
        selectedRows.map((a) => {
            if (e === a) {
                temp = false
            }
        })
        if (temp) {
            changedNew.push(e)
        }
    })
    selectedRows.map(e => {
        var temp = true

        Object.keys(newChildRows).map(a => {
            if (e === a) {
                temp = false
            }
        })
        if (temp) {
            deletedRows.push(e)
        }
    })
    dispatch({
        type: DELETE_SELECTED_ITEM_PROPERTY,
        payload: { tempRows, deletedRows, changedNew }
    })
    dispatch({
        type: SET_IS_ACTIVE_CONFIRMATION,
        payload: true
    })

}

export const addNewProperty = () => (dispatch, getState) => {
    const type = getState().dataGridType.rows[Object.keys(getState().dataGridType.rows)[0]].TYPE
    const newProperty = _createNewProperty(type)
    dispatch({
        type: ADD_NEW_PROPERTY,
        payload: { [newProperty.ROW_ID]: newProperty }
    })
}

const _deleteType = (body) => async dispatch => {
    try {
        let res = await TypeService.deleteType(body);
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
    } catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        return Promise.reject(err)
    }
}

export const deleteType = () => (dispatch, getState) => {
    const TYPE = getState().dataGridType.rows[Object.keys(getState().dataGridType.rows)[0]].TYPE
    const selectedIndex = getState().treeview.selectedItem.selectedIndex
    const body = JSON.stringify({ TYPE })
    const CULTURE = getState().lang.cultur
    const layer = getState().auth.user.active_layer
    dispatch(
        setConfirmation({
            title: "Are you sure you want to delete this?",
            body: <></>,
            agreefunction: async () => {
                if (checkmandatoryFields()) {
                    await dispatch(_deleteType(body))
                    await dispatch(loadTreeviewItem(TypeService.getAll, "TYPE", () => () => { }, CULTURE))
                    dispatch(selectTreeViewItem(selectedIndex, "TYPE", 2))
                }
                else {
                    const body = JSON.stringify({
                        CULTURE,
                        ID: "TYPE.REACT.GENERAL.MANDATORY",
                    });
                    const res = await ResourcelistService.getErrorMessage(layer, body);
                    dispatch(add_error(res.data, 400));
                }
            },
        })
    );
}

export const saveTypeAndProperty = () => async (dispatch, getState) => {
    const anyChangesType = getState().dataGridType.anyChangesType
    const anyChangesProperty = getState().dataGridType.anyChangesProperty
    const CULTURE = getState().lang.cultur
    let body;
    let typebody;
    if (anyChangesType) {
        const lastUpdateUser = getState().auth.user.email
        const now = new Date();
        var newdate = now.getTime();
        var saveVal = getState().dataGridType.rows[Object.keys(getState().dataGridType.rows)[0]]
        var mySaveVal = {}
        Object.keys(saveVal).map(e => {
            if (saveVal[e] !== "" && e !== "HIERARCHY" && e !== "selectedIndex") {
                mySaveVal[e] = saveVal[e]
            }
        })

        typebody = { ...mySaveVal, LAST_UPDT_USER: lastUpdateUser, LAST_UPDT_DATE: newdate }

        try {
            let res = await TypeService.createUpdateType(typebody);
        } catch (err) {
            console.log(err);
            return Promise.reject(err)
        }

    }
    if (anyChangesProperty) {
        const changedRows = getState().dataGridType.changedRows
        const propertyRows = getState().dataGridType.propertyRows
        const deletedRows = getState().dataGridType.deletedRows
        await Promise.all(
            Object.keys(propertyRows).map(async e => {
                if (changedRows.some(s => s === e)) {
                    delete propertyRows[e]["HIEARCHY"]
                    body = JSON.stringify({ ...propertyRows[e] })
                    try {
                        let res = await TypeService.createUpdateProperty(body);
                    }
                    catch { }
                }
            }))
        await Promise.all(
            deletedRows.map(async e => {
                body = JSON.stringify({ ROW_ID: e })
                let res = await TypeService.deleteProperty(body);
            }))
    }
    dispatch(loadTreeviewItem(TypeService.getAll, "TYPE", () => () => { }, CULTURE))
    if (anyChangesType)
        dispatch(loadDrawerMenu(CULTURE))
    dispatch({
        type: AFTER_GO_INDEX_TYPE
    })
}

export const saveTypeFunc = () => async (dispatch, getState) => {
    const CULTURE = getState().lang.cultur
    const layer = getState().auth.user.active_layer
    if (checkmandatoryFields()) {
        dispatch(saveTypeAndProperty())
        return true
    }
    else {
        const body = JSON.stringify({
            CULTURE,
            ID: "TYPE.REACT.GENERAL.MANDATORY",
        });
        const res = await ResourcelistService.getErrorMessage(layer, body);
        dispatch(add_error(res.data, 400));
        return false
    }
}
let cancelToken
export const refreshDataGridType = () => async (dispatch, getState) => {
    const selectedItem = getState().treeview.selectedItem
    try {
        if (cancelToken) {
            cancelToken.cancel();
        }
        cancelToken = axios.CancelToken.source();
        let res = await TypeService.getParentType({ TYPE: selectedItem?.TYPE }, cancelToken)
        dispatch({
            type: SET_ROW_DATAGRID_TYPE,
            payload: [{ ...res?.data }]
        })
        dispatch(fillPropertyTable(res?.data?.TYPE))
    } catch (err) {
        console.log(err);
    }

}

export const cleanAllDataGrid = () => dispatch => {
    dispatch({
        type: CLEAN_ALL_DATAGRID_TYPE
    })
}

export const checkLastOpenItem = () => async (dispatch, getState) => {
    try {
        const tv = getState().treeview.filteredMenuItem
        let res = await ProfileService.getStateWCancel({ "key": "others_settings" })
        var path = window.location.pathname;
        var pathSegments = path.split('/');
        var secondPathElement = pathSegments[2];
        if (secondPathElement === "types") {
            let indis = tv.findIndex((e) => {
                return e.TYPE === res.data.others_settings?.type?.selectedItem
            })
            if (indis !== -1) {
                dispatch(selectTreeViewItem(indis, "TYPE", 2));
            }
        }

    } catch {

    }
}
