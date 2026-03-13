import {
    LOAD_TREEVIEW_ITEMS,
    SELECT_TREEVIEW_ITEM,
    CLEAN_TREEVIEW_SELECT,
    LOAD_FILTERED_TREEVIEW_ITEM,
    SET_FILTERED_LAYER_NAME,
    CLEAN_TREEVIEW,
    LOAD_TREE_VIEW_WIDTH

} from "../types"

import axios from "axios"

import { confirmationPushHistory, myHistoryPush } from "../../utils/historyPush"
import { setGoFunctionConfirmation } from "../confirmation/historyConfirmation"
import TreeView from "../../api/couch/treeView"

export const loadTreeViewWidth = async (path) => async (dispatch, getState) => {
    const userId = getState().auth.user.id
    try {
        let res = await TreeView.get(userId)
        dispatch({
            type: LOAD_TREE_VIEW_WIDTH,
            payload: res.data
        })
        return Promise.resolve(res.data.values)
    } catch (err) {
        if (err.response.status === 404) {
            dispatch(createTreeViewCouch())
        }
    }
}

export const loadFilteredTreeviewItem = () => async (dispatch, getState) => {
    const treeMenuItem = getState().treeview.treeMenuItem
    const filteredLayerName = getState().treeview.filteredLayerName
    if (filteredLayerName !== "NONE") {
        var filteredResponse = treeMenuItem.filter(a => a.LAYER_NAME === filteredLayerName)
        dispatch({
            type: LOAD_FILTERED_TREEVIEW_ITEM,
            payload: filteredResponse
        })
    } else {
        dispatch({
            type: LOAD_FILTERED_TREEVIEW_ITEM,
            payload: treeMenuItem
        })
    }
    return true
}

let cancelToken;
export const loadTreeviewItem = (path, sortPath, afterLoadTreeMenu = () => () => { }, CULTURE) => async (dispatch, getState) => {
    try {
        if (cancelToken) {
            cancelToken.cancel()
        }
        cancelToken = axios.CancelToken.source();
        let res = await path({ CULTURE: CULTURE }, cancelToken);
        var sortedResponse;
        console.log(res);

        sortedResponse = res.data

        await dispatch({
            type: LOAD_TREEVIEW_ITEMS,
            payload: sortedResponse
        });
        await dispatch(loadFilteredTreeviewItem())
        dispatch(afterLoadTreeMenu())
        return Promise.resolve(res.data)
    } catch (err) {
        console.log(err);
        dispatch(await cleanTreeview())
        return Promise.reject(err)
    }
}

export const selectTreeViewItem = (index, breadcrumbPath, historyPathLevel) => async (dispatch, getState) => {
    const filteredMenuLength = getState().treeview.filteredMenuItem.length
    const goFunction = () => {
        if (index === -2) {
            dispatch({
                type: SELECT_TREEVIEW_ITEM,
                payload: { selectedIndex: -2 }
            });
            dispatch(setGoFunctionConfirmation(() => { }));
            myHistoryPush(historyPathLevel, "new")
        }
        else if (index === -3) {
            dispatch({
                type: SELECT_TREEVIEW_ITEM,
                payload: { selectedIndex: -3 }
            });
        }
        else {
            if (index < 0) {
                index = filteredMenuLength - 1
            }
            if (index >= filteredMenuLength) {
                index = 0
            }
            var payload = getState().treeview.filteredMenuItem[parseInt(index)]

            payload = { ...payload, selectedIndex: index }
            dispatch({
                type: SELECT_TREEVIEW_ITEM,
                payload: payload
            });
            myHistoryPush(historyPathLevel, payload?.[breadcrumbPath]?.toLowerCase())
        }
    }
    dispatch(setGoFunctionConfirmation(goFunction))
    dispatch(confirmationPushHistory())
}

export const cleanTreeMenuSelect = () => dispatch => {
    dispatch({
        type: CLEAN_TREEVIEW_SELECT
    })
}

export const setFilteredLayerName = (layerName = "NONE") => dispatch => {
    dispatch({
        type: SET_FILTERED_LAYER_NAME,
        payload: layerName
    })
    dispatch(cleanTreeMenuSelect())
    dispatch(loadFilteredTreeviewItem())
}

export const cleanTreeview = async () => async dispatch => {
    dispatch({
        type: CLEAN_TREEVIEW,
    })
}

export const updateTreeViewCouch = (path, value) => async (dispatch, getState) => {
    const userId = getState().auth.user.id
    const width = getState().treeview.width
    width.values[path] = value
    const body = JSON.stringify({ ...width })
    try {
        let res = await TreeView.update(userId, body)
        width._rev = res.data.rev
        dispatch({
            type: LOAD_TREE_VIEW_WIDTH,
            payload: width
        })
    } catch (err) {
        console.log(err);
    }
}
export const createTreeViewCouch = () => async (dispatch, getState) => {
    const userId = getState().auth.user.id
    const body = JSON.stringify({
        _id: userId.toString(),
        values: {
            overview: 250,
            codelist: 250,
            item: 250,
            resources: 250,
            types: 250,
            tags: 250,
            overviewHierarchy: ["1"]
        }
    })
    try {
        await TreeView.create(body)
    } catch (err) { }
}
let cancelTokenFiler;
export const filterMenu = (text, path, body) => async (dispatch, getState) => {
    let res;
    let value;
    if (cancelTokenFiler) {
        cancelTokenFiler.cancel()
    }
    cancelTokenFiler = axios.CancelToken.source();
    try {
        res = await path(text, body, cancelTokenFiler);
        value = res.data;
        if (text === "") {
            value = getState().treeview.treeMenuItem
        }
    } catch (err) {
        console.log(err);
        value = getState().treeview.treeMenuItem
    }
    dispatch({
        type: LOAD_FILTERED_TREEVIEW_ITEM,
        payload: value
    })
}


export const selectTreeItemAfterSave = (treeMenuName, breadcrumbPath, newItemName) => (dispatch, getState) => {
    const treeItems = getState().treeview.treeMenuItem
    const index = treeItems.findIndex(e => e[treeMenuName] === newItemName)
    dispatch(selectTreeViewItem(index, treeMenuName, breadcrumbPath));
}
