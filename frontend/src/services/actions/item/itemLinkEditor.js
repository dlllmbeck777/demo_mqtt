import {
    LOAD_LINK_EDITOR_SCHEMA_ITEM,
    SET_IS_LINK_ACTIVE,
    UPDATE_LINKS_VALUE,
    SET_IS_ACTIVE_CONFIRMATION,
    CLEAN_LINKS_VALUE,
    TOGGLE_ITEM_LINK_REFRESH

} from "../../actions/types"
import axios from "axios";
import ItemLinkService from "../../api/itemLink"

let cancelToken;
export const loadItemLinkSchema = () => async (dispatch, getState) => {
    if (cancelToken) {
        cancelToken.cancel()
    }
    cancelToken = axios.CancelToken.source();
    const TYPE = getState().drawerMenu.selectedItem.TYPE;
    const CULTURE = getState().lang.cultur;
    const body = JSON.stringify({ TYPE, CULTURE });
    try {
        let res = await ItemLinkService.getLinkSchema(body, cancelToken);
        dispatch({
            type: LOAD_LINK_EDITOR_SCHEMA_ITEM,
            payload: { toType: res.data.TO_TYPE, fromType: res.data.FROM_TYPE }
        })
    } catch (err) {
        dispatch({
            type: LOAD_LINK_EDITOR_SCHEMA_ITEM,
            payload: { toType: false, fromType: false }
        })
    }
}

export const setIsActiveLink = (payload) => dispatch => {
    dispatch({
        type: SET_IS_LINK_ACTIVE,
        payload: payload
    })
}

export const updateItemLink = (value) => async dispatch => {
    dispatch({
        type: UPDATE_LINKS_VALUE,
        payload: value
    })
    dispatch({
        type: SET_IS_ACTIVE_CONFIRMATION,
        payload: true
    })
}

export const deleteItemLink = async (LINK_ID) => {
    const body = JSON.stringify({ LINK_ID })
    try {
        let res = await ItemLinkService.remove(body)
        return Promise.resolve(res.data)
    } catch (err) {
        return Promise.reject(err)
    }
}

export const saveItemLink = () => async (dispatch, getState) => {
    const links = getState().itemLinkEditor.links
    try {
        const body = JSON.stringify({ ...links })
        let res = await ItemLinkService.update(body)
        dispatch({
            type: CLEAN_LINKS_VALUE,
        })
        return true
    } catch (err) {
        console.log(err);
        return false
    }
}
export const refreshLinks = () => dispatch => {
    dispatch({
        type: TOGGLE_ITEM_LINK_REFRESH
    })
}