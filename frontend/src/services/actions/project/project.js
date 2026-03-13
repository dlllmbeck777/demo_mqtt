import {
    UPDATE_DATA_PROJECT,
    LOAD_DATA_PROJECT,
    CLEAN_PROJECT,
    SET_DATABASES_PROJECT,
    SET_KUBERNETES_PROJECT,
    SET_IS_ACTIVE_CONFIRMATION
} from "../types"
import axios from "axios"

import { Chip } from "@mui/material"

import { selectTreeViewItem, loadTreeviewItem, selectTreeItemAfterSave } from "../treeview/treeview"
import ProjectService from "../../api/project"
import ProfileService from "../../api/profile"
import { setLoaderTrue, setLoaderFalse } from "../loader"
import { add_error } from "../error"
export const updateData = (key, value) => (dispatch) => {
    dispatch({
        type: UPDATE_DATA_PROJECT,
        payload: { key, value }
    })
    dispatch({
        type: SET_IS_ACTIVE_CONFIRMATION,
        payload: true
    })
}

export const cleanProjectData = () => (dispatch) => {
    dispatch({
        type: CLEAN_PROJECT,
    })
}

let cancelToken;
export const loadProject = () => async (dispatch, getState) => {
    const ROW_ID = getState().treeview.selectedItem.ROW_ID
    try {
        if (cancelToken) {
            cancelToken.cancel();
        }
        cancelToken = axios.CancelToken.source();
        const body = JSON.stringify({ ROW_ID })
        let res = await ProjectService.getItemValues(body, cancelToken)
        res.data[0].DB_SETTINGS = res.data[0].DB_SETTINGS.HOST
        dispatch({
            type: LOAD_DATA_PROJECT,
            payload: res.data[0]
        })
        try {
            let res = await ProfileService.getState({ "key": "others_settings" })
            ProfileService.updateProfileSettings({ others_settings: { ...res.data?.others_settings, project: { selectedItem: ROW_ID } } })
        } catch (err) {
            console.log(err);
        }
    } catch {

    }
}

export const deleteProject = () => async (dispatch, getState) => {
    const ROW_ID = getState().treeview.selectedItem.ROW_ID
    const selectedIndex = getState().treeview.selectedItem.selectedIndex
    const CULTURE = getState().lang.cultur
    const body = JSON.stringify({ ROW_ID });
    dispatch(setLoaderTrue())
    try {
        let res = await ProjectService.remove(body)
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        await dispatch(loadTreeviewItem(async (body, cancelToken) => {
            return await ProjectService.getAll(body, cancelToken);
        }, "NAME", () => () => { }, CULTURE))
        dispatch(selectTreeViewItem(selectedIndex, "NAME"));
        dispatch(setLoaderFalse())
        return true
    }
    catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        dispatch(setLoaderFalse())
    }
}

export const saveProject = () => async (dispatch, getState) => {
    const isNew = getState().treeview.selectedItem.selectedIndex
    const data = getState().project.data
    const kubernetes = getState().project.kubernetes
    const CULTURE = getState().lang.cultur
    const body = Object.assign({}, data);
    try {
        dispatch(setLoaderTrue())
        body.DB_SETTINGS = kubernetes.filter(e => e.HOST === body.DB_SETTINGS)[0]
        body.DB_SETTINGS.NAME = body.LAYER_NAME.toLowerCase().replace(/ /g, "_");
        delete body.DB_SETTINGS.status
        console.log(JSON.stringify(body));
        if (isNew === -2) {
            try {
                let res = await ProjectService.create(body)
                console.log(res);
                dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
            } catch (err) {
                dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
            }
        } else {
            try {
                let res = await ProjectService.update(body)
                dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
            } catch (err) {
                dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
            }
        }
        await dispatch(loadTreeviewItem(async (body, cancelToken) => {
            return await ProjectService.getAll(body, cancelToken);
        }, "NAME", () => () => { }, CULTURE))
        dispatch(selectTreeItemAfterSave("LAYER_NAME", 2, body.LAYER_NAME))
        dispatch(setLoaderFalse())
        return true

    } catch (err) {
        dispatch(setLoaderFalse())

        console.log(err);
    }
}

export const loadDatabases = () => async (dispatch, getState) => {
    try {
        const CULTURE = getState().lang.cultur
        let res = await ProjectService.databases({ CULTURE })
        console.log(res);
        dispatch({
            type: SET_DATABASES_PROJECT,
            payload: res.data
        })
    } catch (err) {
        console.log(err);
    }
}

export const loadKubernetes = () => async (dispatch, getState) => {
    try {
        const CULTURE = getState().lang.cultur
        const ds = getState().project.data.DATA_SOURCE
        const text = ds + "/" + CULTURE
        let res = await ProjectService.kubernetes(text)
        Promise.all(
            res.data.map(e => {
                e["NAME"] =
                    <Chip
                        label={e.HOST}
                        variant="outlined"
                        size="small"
                        sx={{
                            color: e.status ? "green" : "red" + " !important",
                            borderColor: e.status ? "green" : "red" + " !important"
                        }}
                    />
            })
        )
        dispatch({
            type: SET_KUBERNETES_PROJECT,
            payload: res.data
        })
    } catch {

    }
}

export const checkLastOpenItem = () => async (dispatch, getState) => {
    try {
        const tv = getState().treeview.filteredMenuItem
        let res = await ProfileService.getStateWCancel({ "key": "others_settings" })
        var path = window.location.pathname;
        var pathSegments = path.split('/');
        var secondPathElement = pathSegments[2];
        if (secondPathElement === "project") {
            let indis = tv.findIndex((e) => {
                return e.ROW_ID === res.data.others_settings?.project?.selectedItem
            })
            if (indis !== -1) {
                dispatch(selectTreeViewItem(indis, "LAYER_NAME", 2));
            }
        }

    } catch {

    }
}
