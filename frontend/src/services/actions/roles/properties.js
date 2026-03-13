import {
    SET_IS_ACTIVE_CONFIRMATION,
    LOAD_ROLES_PROPERTY,
    UPDATE_ROLES_NAME_PROPERTY
} from "../types"
import { setConfirmation } from "../../reducers/confirmation";
import Roles from "../../api/roles"
import ProfileService from "../../api/profile";
import NewRoleSavePopUp from "../../../pages/main/administration/roles/properties/newRoleSavePopUp";
import { loadTreeviewItem, selectTreeItemAfterSave, selectTreeViewItem } from "../treeview/treeview"
import { add_error } from "../error";
import { uuidv4 } from "../../utils/uuidGenerator"
import { loadingToggle } from "../datagrid/datagrid";
import { setRowsDatagrid } from "../datagrid/rows";
import resourceList from "../../api/resourceList";
const refreshTreeView = () => async (dispatch, getState) => {
    const CULTURE = getState().lang.cultur
    await dispatch(loadTreeviewItem(async (body, cancelToken) => {
        return await Roles.getAll(body, cancelToken);
    }, "ROLES_NAME", () => () => { }, CULTURE))
    return true
}

const loadRolesProperty = (ROLES_NAME = "", ROLES_ID = uuidv4().replace(/-/g, "")) => (dispatch, getState) => {
    const LAST_UPDATE_USER = getState().auth.user.email
    const layer = getState().auth.user.active_layer
    dispatch({
        type: LOAD_ROLES_PROPERTY,
        payload: {
            LAYER_NAME: layer,
            ROLES_ID,
            ROLES_NAME,
            LAST_UPDATE_USER
        }
    })
}

export const loadNewRolesSchema = () => async (dispatch, getState) => {
    try {
        dispatch(loadingToggle(true))
        const CULTURE = getState().lang.cultur
        const body = JSON.stringify({ CULTURE })
        let res = await Roles.getType(body)
        console.log(res.data);
        let data = []
        function adaptChildtoDatagrid(val, hierarchy) {
            console.log(val);
            Promise.all(
                val.map(e => {
                    console.log(e);
                    let ROW_ID = uuidv4().replace(/-/g, "")
                    data.push({ ...e, ROW_ID, hierarchy: [...hierarchy, e.ROLES_INFO], id: ROW_ID })
                    if (e?.CHILD?.length > 0) {
                        adaptChildtoDatagrid(e.CHILD, [...hierarchy, e.ROLES_INFO])
                    }
                })
            )
            return true
        }
        adaptChildtoDatagrid(res.data, [])
        dispatch(loadRolesProperty())
        dispatch(setRowsDatagrid(data))
        dispatch(loadingToggle(false))

    } catch { }
}

export const changeRoleName = (value) => dispatch => {
    dispatch({
        type: UPDATE_ROLES_NAME_PROPERTY,
        payload: value
    })
    dispatch({
        type: SET_IS_ACTIVE_CONFIRMATION,
        payload: true
    })
}

export const updateRole = () => async (dispatch, getState) => {
    const ROLES = getState().roles.roles
    const property = getState().datagrid.rows
    let body = {}
    let copyRows = JSON.parse(JSON.stringify(property));
    const PROPERTY = copyRows.map(e => {
        delete e.id
        delete e.hierarchy
        delete e.CHILD
        return e
    })
    body = JSON.stringify({ ROLES, PROPERTY })

    console.log(body);
    try {
        let res = await Roles.saveRole(body)
        console.log(res);
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        await dispatch(refreshTreeView())
        dispatch({
            type: SET_IS_ACTIVE_CONFIRMATION,
            payload: false
        })
        dispatch(selectTreeItemAfterSave("ROLES_NAME", 2, ROLES.ROLES_NAME))
    } catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
    }

    return true
}

const createRole = () => (dispatch, getState) => {
    dispatch(
        setConfirmation({
            title: "Specify a name for the role",
            body: <NewRoleSavePopUp />,
            agreefunction: async () => {
                await dispatch(updateRole());
            },
        })
    );
}

export const saveRole = () => async (dispatch, getState) => {
    const CULTURE = getState().lang.cultur
    const isNewRole = getState().treeview.selectedItem.selectedIndex
    const roleName = getState().roles.roles.ROLES_NAME
    const roleId = getState().roles.roles.ROLES_ID
    const currentRole = getState().auth.user.role.ROLES_ID
    try {
        if (isNewRole === -2)
            dispatch(createRole())
        else {
            const res = await resourceList.getResourcelist({
                CULTURE,
                PARENT: "POPUP",
            });
            dispatch(
                setConfirmation({
                    title: res.data?.filter((e) => e.ID === "TYPE.POPUP.SAVE")?.[0]
                        ?.SHORT_LABEL,
                    body: `${roleName}`,
                    agreefunction: async () => {
                        await dispatch(updateRole())
                        if (roleId === currentRole)
                            window.location.reload()
                    },
                })
            );
        }
    } catch (err) {
        console.log(err);
    }
}

const loadRolesProperties = (ROLES_ID) => async dispatch => {
    try {
        dispatch(loadingToggle(true))
        const body = JSON.stringify({ ROLES_ID })
        let res = await Roles.getRoleProp(body)
        console.log(res.data);
        let data = []
        function adaptChildtoDatagrid(val, hierarchy) {
            Promise.all(
                val.map(e => {
                    console.log(e);
                    let ROW_ID = uuidv4().replace(/-/g, "")
                    data.push({ ...e, hierarchy: [...hierarchy, e.ROLES_INFO], id: ROW_ID })
                    if (e?.CHILD) {
                        adaptChildtoDatagrid(e.CHILD, [...hierarchy, e.ROLES_INFO])
                    }
                })
            )
            return true
        }
        adaptChildtoDatagrid(res.data, [])
        dispatch(setRowsDatagrid(data))
        dispatch(loadingToggle(false))
        try {
            let res = await ProfileService.getState({ "key": "others_settings" })
            ProfileService.updateProfileSettings({ others_settings: { ...res.data?.others_settings, roles: { selectedItem: ROLES_ID } } })
        } catch (err) {
            console.log(err);
        }
    } catch {
        dispatch(loadingToggle(false))
    }
}

export const loadRolesProps = () => async (dispatch, getState) => {
    const roleName = getState().treeview.selectedItem.ROLES_NAME
    const roleId = getState().treeview.selectedItem.ROLES_ID
    dispatch(loadRolesProperty(roleName, roleId))
    dispatch(loadRolesProperties(roleId))
}

export const deleteRole = () => async (dispatch, getState) => {
    const ROLES_ID = getState().treeview.selectedItem.ROLES_ID
    const selectedIndex = getState().treeview.selectedItem.selectedIndex
    try {
        const body = JSON.stringify({ ROLES_ID })
        let res = await Roles.removeRole(body)
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        await dispatch(refreshTreeView())
        dispatch(selectTreeViewItem(selectedIndex, "ROLES_NAME", 2));
    } catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
    }
}

export const checkLastOpenItem = () => async (dispatch, getState) => {
    try {
        const tv = getState().treeview.filteredMenuItem
        let res = await ProfileService.getStateWCancel({ "key": "others_settings" })
        var path = window.location.pathname;
        var pathSegments = path.split('/');
        var secondPathElement = pathSegments[2];
        if (secondPathElement === "roles") {
            let indis = tv.findIndex((e) => {
                return e.ROLES_ID === res.data.others_settings?.roles?.selectedItem
            })
            if (indis !== -1) {
                dispatch(selectTreeViewItem(indis, "ROLES_NAME", 2));
            }
        }

    } catch {

    }
}
