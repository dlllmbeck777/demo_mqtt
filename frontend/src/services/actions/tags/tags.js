import {
    LOAD_TAGS_LABEL,
    SET_TAG_SAVE_VALUES,
    CLEAN_ALL_TAGS,
    FILL_SAVE_VALUES_TAGS
} from "../types"


import {
    setConfirmation,
} from "../../reducers/confirmation";
import { add_error } from "../error";
import ProfileService from "../../api/profile";
import { loadTreeviewItem, selectTreeViewItem, selectTreeItemAfterSave } from "../treeview/treeview";
import { setIsActiveConfirmation } from "../confirmation/historyConfirmation";
import { uuidv4 } from "../../utils/uuidGenerator"

export const fillTagData = (tagId, service) => async (dispatch, getState) => {
    try {
        const body = JSON.stringify({ TAG_ID: tagId })
        let res = await service.getTagItem(body)
        dispatch({
            type: FILL_SAVE_VALUES_TAGS,
            payload: res.data[0]
        })
        try {
            let res = await ProfileService.getState({ "key": "others_settings" })
            ProfileService.updateProfileSettings({ others_settings: { ...res.data?.others_settings, tag_item: { selectedItem: tagId } } })
        } catch (err) {
            console.log(err);
        }
        return Promise.resolve(res.data)
    } catch (err) {
        return Promise.reject(err)
    }
}

export const loadTagsLabel = (service) => async (dispatch, getState) => {
    try {
        const CULTURE = getState().lang.cultur
        let res = await service.getTagsProperty({ CULTURE })
        console.log(res.data);
        console.log(service);
        if (res.data?.TAG_CALCULATED)
            dispatch({
                type: LOAD_TAGS_LABEL,
                payload: { "TAG_INFORMATIONS": [...res.data?.TAG_INFO, ...res.data?.TAG_CALCULATED], "TAG_LINK": res.data?.TAG_LINK }
            })
        else
            dispatch({
                type: LOAD_TAGS_LABEL,
                payload: { "TAG_INFORMATIONS": res.data?.TAG_INFO, "TAG_LINK": res.data?.TAG_LINK }
            })
        return Promise.resolve(res.data)
    } catch (err) {
        console.log(err);
        return Promise.reject(err)
    }
}

export const cleanSaveValue = () => dispatch => {
    dispatch({
        type: FILL_SAVE_VALUES_TAGS,
        payload: {}
    })
}

export const addNewTag = (service) => async (dispatch, getState) => {
    dispatch({
        type: FILL_SAVE_VALUES_TAGS,
        payload: {}
    })
    await dispatch(loadTagsLabel(service))
    dispatch({
        type: SET_TAG_SAVE_VALUES,
        payload: { key: "TAG_ID", value: uuidv4().replace(/-/g, ""), }
    })

}

export const addSaveTagValue = (key, value) => (dispatch) => {
    dispatch({
        type: SET_TAG_SAVE_VALUES,
        payload: { key: key, value: value }
    })
}

export const cleanAllTags = () => dispatch => {
    dispatch({
        type: CLEAN_ALL_TAGS
    })
}

const _newTagSave = (saveValues, user, service) => async dispatch => {
    var newUuid = uuidv4()
    console.log({
        ...saveValues,
        "ROW_ID": saveValues.ROW_ID ? saveValues.ROW_ID : newUuid.replace(/-/g, ""),
        "LINK_ID": saveValues.LINK_ID ? saveValues.LINK_ID : newUuid.replace(/-/g, ""),
    });
    const body = JSON.stringify({
        ...saveValues,
        "ROW_ID": saveValues.ROW_ID ? saveValues.ROW_ID : newUuid.replace(/-/g, ""),
        "LINK_ID": saveValues.LINK_ID ? saveValues.LINK_ID : newUuid.replace(/-/g, ""),
    })

    try {
        let res = await service.createAndUpdate(body)
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        return Promise.resolve(res.data)
    } catch (err) {
        console.log(err);
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        return Promise.reject(err)
    }
}

export const saveTag = (service) => async (dispatch, getState) => {
    const values = getState().tags.saveValues
    const properties = getState().tags.tagValues
    const CULTURE = getState().lang.cultur
    var user = getState().auth.user.email
    const saveValues = getState().tags.saveValues
    if (_checkmandatoryFields(values, properties)) {
        let res = await dispatch(_newTagSave(saveValues, user, service))
        await dispatch(loadTreeviewItem(service.getAll, "NAME", () => () => { }, CULTURE))
        dispatch(setIsActiveConfirmation(false))
        dispatch(selectTreeItemAfterSave("NAME", 3, saveValues.NAME))
        return Promise.resolve(res.data)
    }
    else {
        dispatch(add_error("Pleas check mandatory fields", 500));
        return false
    }
}

export const saveButton = (service) => async (dispatch, getState) => {
    const name = getState().treeview.selectedItem.NAME
    dispatch(
        setConfirmation({
            title: "You want to save this ?",
            body: <>{name}</>,
            agreefunction: async () => {
                await dispatch(saveTag(service))
            },
        })
    );
}

const _deleteTag = (TAG_ID, service) => async dispatch => {
    try {
        const body = JSON.stringify({ TAG_ID })
        let res = await service.remove(body)
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        return Promise.resolve(res.data)
    } catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        return Promise.reject(err);
    }
}

export const deleteTag = (service) => async (dispatch, getState) => {
    const tagId = getState().treeview.selectedItem.TAG_ID
    const selectedIndex = getState().treeview.selectedItem.selectedIndex
    const CULTURE = getState().lang.cultur
    const name = getState().treeview.selectedItem.NAME
    dispatch(
        setConfirmation({
            title: "Are you sure you want to delete this?",
            body: <>{name}</>,
            agreefunction: async () => {
                dispatch(cleanAllTags())
                await dispatch(_deleteTag(tagId, service))
                await dispatch(loadTreeviewItem(service.getAll, "NAME", () => () => { }, CULTURE));
                dispatch(selectTreeViewItem(selectedIndex, "NAME"))
                dispatch(loadTagsLabel(service))
            },
        })
    );
}

const mandatoryFields = (properties) => {
    return properties.filter(e => e.MANDATORY === "True")
}

const _checkmandatoryFields = (values, properties) => {
    var myPropInformation = mandatoryFields(properties.TAG_INFORMATIONS);
    var myPropLink = mandatoryFields(properties.TAG_LINK);
    var returnval = true

    myPropInformation.map(e => {
        if (!values[e.PROPERTY_NAME] && e.PROPERTY_NAME !== "ITEM_ID") {
            returnval = false
        }
    })
    myPropLink.map(e => {
        if (!values[e.PROPERTY_NAME] && e.PROPERTY_NAME !== "ITEM_ID") {
            returnval = false
        }
    })
    return returnval
}

export const checkLastOpenItem = () => async (dispatch, getState) => {
    try {
        const tv = getState().treeview.filteredMenuItem
        let res = await ProfileService.getStateWCancel({ "key": "others_settings" })
        var path = window.location.pathname;
        var pathSegments = path.split('/');
        var secondPathElement = pathSegments[2];
        if (secondPathElement === "tags") {
            let indis = tv.findIndex((e) => {
                return e.TAG_ID === res.data.others_settings?.tag_item?.selectedItem
            })
            console.log(indis);
            if (indis !== -1) {
                dispatch(selectTreeViewItem(indis, "NAME", 3));
            }
        }

    } catch {

    }
}
