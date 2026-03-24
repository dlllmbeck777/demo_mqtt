import {
    LOAD_COLLAPSABLE_MENU_ITEMS,
    SET_SELECTED_COLLAPSE_MENU_ITEM,
    LOAD_TREE_VIEW_WIDTH,
    UPDATE_TREE_VIEW_WIDTH_HIERARCHY,
    SET_COLLAPSE_FILTER_MENU,
} from "../types"

import axios from "axios"
import ProfileService from "../../api/profile"
import { loadHorizontalMenu } from "./horizontaMenu"
import history from "../../../routers/history"
import { cleanTabs, loadTapsOverview } from "../overview/taps"
import { persistTreeViewDocument } from "../treeview/treeview"

const OVERVIEW_HIERARCHY_PERSIST_DELAY_MS = 300
let overviewHierarchyPersistTimer = null

const encodeOverviewSegment = (value = "") =>
    String(value || "").replaceAll("/", "U+002F")

const findMenuItem = (items, selectedItem, currentPath = "overview") => {
    if (!selectedItem) {
        return null
    }

    for (const item of items || []) {
        const itemPath = `${currentPath}/${encodeOverviewSegment(item?.FROM_ITEM_NAME)}`
        const itemWithPath = {
            ...item,
            path: itemPath,
        }

        if (
            itemWithPath?.FROM_ITEM_ID === selectedItem?.FROM_ITEM_ID ||
            itemWithPath?.path === selectedItem?.path
        ) {
            return itemWithPath
        }

        const child = findMenuItem(item?.CHILD, selectedItem, itemPath)
        if (child) {
            return child
        }
    }

    return null
}

const getOverviewSelectedItemKey = (getState) => {
    const layer = String(getState()?.auth?.user?.active_layer || "Inkai").trim() || "Inkai"
    return `selectedItem:${layer}`
}

const getOverviewSelectedPathKey = (getState) => {
    const layer = String(getState()?.auth?.user?.active_layer || "Inkai").trim() || "Inkai"
    return `selectedPath:${layer}`
}

const normalizeOverviewPath = (path = "") =>
    decodeURIComponent(String(path || ""))
        .replace(/^\/+/, "")
        .replace(/\/+$/, "")

const getOverviewHierarchyKeys = (getState) => {
    const layer = String(getState()?.auth?.user?.active_layer || "Inkai").trim() || "Inkai"
    return {
        overviewHierarchyKey: `${layer}:overviewHierarchy`,
        legacyOverviewHierarchyKey: "overviewHierarchy",
    }
}

const persistOverviewHierarchyProfile = async (nextExpanded, getState) => {
    try {
        const res = await ProfileService.getState({ key: "overview_settings" })
        const { overviewHierarchyKey, legacyOverviewHierarchyKey } =
            getOverviewHierarchyKeys(getState)

        await ProfileService.updateProfileSettings({
            overview_settings: {
                ...res.data?.overview_settings,
                [overviewHierarchyKey]: nextExpanded,
                [legacyOverviewHierarchyKey]: nextExpanded,
            }
        })
    } catch (err) {
        console.log(err);
    }
}

const persistOverviewHierarchyState = async (dispatch, getState, nextExpanded) => {
    const userId = getState()?.auth?.user?.id
    await persistOverviewHierarchyProfile(nextExpanded, getState)

    if (!userId) {
        return
    }

    const treeViewWidth = getState().treeview.width
    const nextValues = {
        ...(treeViewWidth?.values || {}),
        overviewHierarchy: nextExpanded,
    }

    try {
        const savedDoc = await persistTreeViewDocument(
            userId,
            nextValues,
            treeViewWidth,
            getState,
        )
        dispatch({
            type: LOAD_TREE_VIEW_WIDTH,
            payload: savedDoc
        })
    } catch (err) {
        console.log(err);
    }
}
export const loadCollapseMenu = (path) => async dispatch => {
    try {
        let res = await path();
        dispatch({
            type: LOAD_COLLAPSABLE_MENU_ITEMS,
            payload: res.data
        });
        dispatch({
            type: SET_COLLAPSE_FILTER_MENU,
            payload: res.data
        })
        dispatch(loadHorizontalMenu())
        dispatch(checkLastOpenItem())
        return Promise.resolve(res.data)
    } catch (err) {
        return Promise.reject(err)
    }
}

export const setSelectedCollapseMenu = async (value) => async (dispatch, getState) => {
    dispatch({
        type: SET_SELECTED_COLLAPSE_MENU_ITEM,
        payload: value
    })
    try {
        let res = await ProfileService.getState({ "key": "overview_settings" })
        const selectedItemKey = getOverviewSelectedItemKey(getState)
        const selectedPathKey = getOverviewSelectedPathKey(getState)
        await ProfileService.updateProfileSettings({
            overview_settings: {
                ...res.data?.overview_settings,
                [selectedItemKey]: value,
                [selectedPathKey]: value?.path,
                selectedItem: value
            }
        })
    } catch (err) {
        console.log(err);
    }
}

export const updateCollapseMenuCouch = (value) => async (dispatch, getState) => {
    const nextExpanded = (value || []).map((item) => String(item))
    dispatch({
        type: UPDATE_TREE_VIEW_WIDTH_HIERARCHY,
        payload: nextExpanded
    })

    if (overviewHierarchyPersistTimer) {
        clearTimeout(overviewHierarchyPersistTimer)
    }

    overviewHierarchyPersistTimer = setTimeout(() => {
        overviewHierarchyPersistTimer = null
        persistOverviewHierarchyState(dispatch, getState, nextExpanded)
    }, OVERVIEW_HIERARCHY_PERSIST_DELAY_MS)
}

export const overviewBreadcrumpGo = (items, path) => {
    let returnVal = "overview"
    path = decodeURIComponent(path)
    function myFunc(myItems, myPath) {
        Promise.all(myItems.map(e => {
            if (myPath + `/${e.FROM_ITEM_NAME.replaceAll("/", "U+002F")}` === path) {
                returnVal = { ...e, path: myPath + `/${e.FROM_ITEM_NAME.replaceAll("/", "U+002F")}` }
            }
            if (e.CHILD) {
                myFunc(e.CHILD, myPath + `/${e.FROM_ITEM_NAME.replaceAll("/", "U+002F")}`)
            }
        }))
    }
    myFunc(items, "overview")
    return returnVal
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
            value = getState().collapseMenu.menuItems
        }
    } catch (err) {
        console.log(err);
        value = getState().collapseMenu.menuItems
    }
    dispatch({
        type: SET_COLLAPSE_FILTER_MENU,
        payload: value
    })
}
export const checkLastOpenItem = () => async (dispatch, getState) => {
    try {
        let res = await ProfileService.getStateWCancel({ "key": "overview_settings" })
        var path = window.location.pathname;
        var pathSegments = path.split('/');
        var firstPathElement = pathSegments[1];
        if (firstPathElement === "overview") {
            const selectedItemKey = getOverviewSelectedItemKey(getState)
            const selectedPathKey = getOverviewSelectedPathKey(getState)
            const currentOverviewPath = normalizeOverviewPath(path)
            const savedPath =
                res.data?.overview_settings?.[selectedPathKey] ??
                res.data?.overview_settings?.selectedItem?.path
            const selectedItemFromPath =
                currentOverviewPath !== "overview"
                    ? findMenuItem(getState().collapseMenu.menuItems, { path: currentOverviewPath })
                    : null
            const savedSelectedItem =
                res.data?.overview_settings?.[selectedItemKey] ??
                res.data?.overview_settings?.[`selectedItem`]
            const selectedItem =
                selectedItemFromPath ||
                findMenuItem(
                    getState().collapseMenu.menuItems,
                    savedSelectedItem
                ) ||
                (savedPath
                    ? findMenuItem(
                        getState().collapseMenu.menuItems,
                        { path: normalizeOverviewPath(savedPath) }
                    )
                    : null)

            if (!selectedItem) {
                dispatch(cleanTabs())
                dispatch({
                    type: SET_SELECTED_COLLAPSE_MENU_ITEM,
                    payload: null
                })
                history.push(`/overview`)
                return
            }

            dispatch({
                type: SET_SELECTED_COLLAPSE_MENU_ITEM,
                payload: selectedItem
            })
            try {
                await dispatch(loadTapsOverview());
                if (selectedItem?.path?.startsWith("overview/")) {
                    history.push(`/${selectedItem.path}`);
                } else {
                    history.push(`/overview`);
                }
            } catch (err) {
                dispatch(cleanTabs())
                history.push(`/overview`)
            }
        }

    } catch {
        dispatch(cleanTabs())
        dispatch({
            type: SET_SELECTED_COLLAPSE_MENU_ITEM,
            payload: null
        })
        if (window.location.pathname.startsWith("/overview")) {
            history.push("/overview")
        }
    }
}
