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
import ProfileService from "../../api/profile"

const DEFAULT_TREE_VIEW_VALUES = {
    overview: 250,
    codelist: 250,
    item: 250,
    resources: 250,
    types: 250,
    tags: 250,
    overviewHierarchy: ["1"],
}

const getStateSnapshot = (getState) =>
    typeof getState === "function" ? getState() : {}

const getOverviewHierarchyKeys = (getState) => {
    const state = getStateSnapshot(getState)
    const layer = String(state?.auth?.user?.active_layer || "Inkai").trim() || "Inkai"
    return {
        overviewHierarchyKey: `${layer}:overviewHierarchy`,
        legacyOverviewHierarchyKey: "overviewHierarchy",
    }
}

const buildTreeViewDocument = (userId, baseDoc = {}, nextValues = {}) => ({
    _id: userId.toString(),
    ...(baseDoc?._rev ? { _rev: baseDoc._rev } : {}),
    values: {
        ...DEFAULT_TREE_VIEW_VALUES,
        ...(baseDoc?.values || {}),
        ...nextValues,
    },
})

const applyOverviewHierarchy = (userId, baseDoc = {}, overviewHierarchy = []) => {
    if (!Array.isArray(overviewHierarchy)) {
        return buildTreeViewDocument(userId, baseDoc)
    }

    return buildTreeViewDocument(userId, baseDoc, {
        overviewHierarchy: overviewHierarchy.map((item) => String(item)),
    })
}

const loadOverviewHierarchyFromProfile = async (getState) => {
    try {
        const res = await ProfileService.getState({ key: "overview_settings" })
        const { overviewHierarchyKey, legacyOverviewHierarchyKey } =
            getOverviewHierarchyKeys(getState)

        return (
            res?.data?.overview_settings?.[overviewHierarchyKey] ??
            res?.data?.overview_settings?.[legacyOverviewHierarchyKey]
        )
    } catch (err) {
        console.log(err);
        return null
    }
}

const createTreeViewDocument = async (userId, nextValues = {}) => {
    const payload = buildTreeViewDocument(userId, {}, nextValues)
    try {
        const res = await TreeView.create(JSON.stringify(payload))
        return {
            ...payload,
            _rev: res?.data?.rev,
        }
    } catch (err) {
        if (err?.response?.status === 409) {
            const latest = await TreeView.get(userId)
            return latest.data
        }
        throw err
    }
}

export const ensureTreeViewDocument = async (userId) => {
    try {
        const res = await TreeView.get(userId)
        return buildTreeViewDocument(userId, res.data)
    } catch (err) {
        if (err?.response?.status === 404) {
            return createTreeViewDocument(userId)
        }
        throw err
    }
}

export const persistTreeViewDocument = async (userId, nextValues = {}, currentDoc = {}) => {
    const payload = buildTreeViewDocument(userId, currentDoc, nextValues)
    try {
        const res = await TreeView.update(userId, JSON.stringify(payload))
        return {
            ...payload,
            _rev: res?.data?.rev,
        }
    } catch (err) {
        if (err?.response?.status === 404) {
            return createTreeViewDocument(userId, nextValues)
        }
        if (err?.response?.status === 409) {
            const latest = await ensureTreeViewDocument(userId)
            const retryPayload = buildTreeViewDocument(userId, latest, nextValues)
            const res = await TreeView.update(userId, JSON.stringify(retryPayload))
            return {
                ...retryPayload,
                _rev: res?.data?.rev,
            }
        }
        throw err
    }
}

export const loadTreeViewWidth = async (path) => async (dispatch, getState) => {
    const state = getStateSnapshot(getState)
    const userId = state?.auth?.user?.id || "anonymous"
    try {
        let res = await ensureTreeViewDocument(userId)
        const savedOverviewHierarchy = await loadOverviewHierarchyFromProfile(getState)
        res = applyOverviewHierarchy(userId, res, savedOverviewHierarchy)
        dispatch({
            type: LOAD_TREE_VIEW_WIDTH,
            payload: res
        })
        return Promise.resolve(res.values)
    } catch (err) {
        console.log(err);
        const savedOverviewHierarchy = await loadOverviewHierarchyFromProfile(getState)
        const fallback = applyOverviewHierarchy(
            userId,
            buildTreeViewDocument(userId),
            savedOverviewHierarchy
        )
        dispatch({
            type: LOAD_TREE_VIEW_WIDTH,
            payload: fallback
        })
        return Promise.resolve(fallback.values)
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
    const nextValues = {
        ...(width?.values || {}),
        [path]: value,
    }
    try {
        const savedDoc = await persistTreeViewDocument(userId, nextValues, width)
        dispatch({
            type: LOAD_TREE_VIEW_WIDTH,
            payload: savedDoc
        })
    } catch (err) {
        console.log(err);
    }
}
export const createTreeViewCouch = () => async (dispatch, getState) => {
    const userId = getState().auth.user.id
    try {
        const savedDoc = await createTreeViewDocument(userId)
        dispatch({
            type: LOAD_TREE_VIEW_WIDTH,
            payload: savedDoc
        })
        return savedDoc
    } catch (err) {
        console.log(err);
    }
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
