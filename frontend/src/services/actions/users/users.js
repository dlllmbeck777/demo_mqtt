import Users from "../../api/users"
import { setLoaderFalse, setLoaderTrue } from "../loader";
import { add_error } from "../error";
import { fetchData, formatData, setDatagridHeaders, setType } from "../datagrid/columns";
import { cleanAfterSave, cleanAllValues, helperCreate } from "../datagrid/utils";
import { loadingToggle } from "../datagrid/datagrid";
import { adjustColumnWidth, setRowsDatagrid } from "../datagrid/rows";
const getUsers = () => async dispatch => {
    try {
        dispatch(cleanAllValues());
        dispatch(loadingToggle(true))
        let res = await Users.getAll()
        dispatch(adjustColumnWidth(res.data))
        dispatch(setRowsDatagrid(res.data))
        dispatch(loadingToggle(false))
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err)
    }
}

export const _loadHeaders = () => async (dispatch, getState) => {
    const CULTURE = getState().lang.cultur
    const activeLayer = getState().auth.user.active_layer
    try {
        let res = await fetchData(CULTURE, "USERS")
        dispatch(setType(res))
        let columns = formatData(res, true, true)
        if (activeLayer === "STD") {
            dispatch(setDatagridHeaders(columns))
        } else {
            dispatch(setDatagridHeaders([...columns.filter(e => e.field !== "layer_name")]))
        }
        return Promise.resolve(res.data)
    } catch (err) {
        return Promise.reject(err)
    }
}

export const loadUsers = () => async (dispatch, getState) => {
    try {
        await dispatch(_loadHeaders())
        await dispatch(getUsers())
    } catch {

    }
}
export const checkActiveLayer = (instantUser) => dispatch => {
    if (instantUser.layer_name.find(e => e === instantUser.active_layer) === undefined) {
        window.location.reload()
    }
}

export const saveUsers = () => async (dispatch, getState) => {
    const instantUser = getState().auth.user
    const createdRows = getState().datagrid.createdRows
    const updatedRows = getState().datagrid.updatedRows
    const deletedRows = getState().datagrid.deletedRows
    const CULTURE = getState().lang.cultur
    const rows = getState().datagrid.rows
    const copyRows = JSON.parse(JSON.stringify(rows));
    const CREATE = copyRows.filter(row => createdRows.includes(row.id)).map(e => {
        return e
    })
    const UPDATE = copyRows.filter(row => updatedRows.includes(row.id)).map(e => {
        return e
    })
    const DELETE = deletedRows.map(e => {
        return e.id
    })
    await dispatch(helperCreate("USERS", CREATE, UPDATE, DELETE, CULTURE))
    dispatch(cleanAfterSave())
    dispatch(checkActiveLayer(instantUser))
    dispatch(getUsers())
    return true

}

export const saveUsers1 = () => async (dispatch, getState) => {
    const instantUser = getState().auth.user
    const users = getState().users.users
    const deletedUsers = getState().users.deletedUsers
    const updatedUsers = getState().users.updatedUsers
    const updatedLayer = getState().users.updatedLayer
    const updatedRoles = getState().users.updatedRoles
    setLoaderTrue()
    try {
        if (updatedLayer.length > 0) {
            let body = { users: [] }
            users.filter(e => updatedLayer.find(a => a === e.id)).map(e => {
                body.users.push({ email: e.email, layer_name: e.layer_name })
            })
            body = JSON.stringify(body)
            console.log(body);
            await Users.updateUserLayer(body)
        }
        if (updatedRoles.length > 0) {
            let roleUpadatebody = { users: [] }
            users.filter(e => updatedRoles.find(a => a === e.id)).map(e => {
                roleUpadatebody.users.push({ email: e.email, role: e.role })
            })
            await Users.updateUserRole(roleUpadatebody)
        }
        if (deletedUsers.length > 0) {
            const deleteBody = JSON.stringify({ users: deletedUsers, LAYER_NAME: instantUser.active_layer })
            await Users.removeUser(deleteBody)
        }
        if (updatedUsers.find(e => e === instantUser.id) !== undefined) {
            dispatch(getUsers())
        }
        dispatch(checkActiveLayer(instantUser))
        dispatch(getUsers())
        setLoaderFalse()
    } catch (err) {
        setLoaderFalse()
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        console.log(err);
    }
}

export const addNewUser = (body) => async (dispatch) => {
    try {
        console.log(body);
        let res = await Users.createUser(body)
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        dispatch(getUsers())
    } catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
    }
}