import {
    SET_SELECTED_DRAWER_ITEM,
    LOAD_DRAWER_MENU,
    DRAWER_MENU_SET_OPEN,
} from "../types"
import $ from "jquery"
import DrawerMenu from "../../api/drawerMenu";
import ProfileService from "../../api/profile";
import { urlFormatter } from "../../utils/urlFormatter";

const configureSubMenu = (params) => {
    if (params !== undefined)
        Object.keys(params).map(e => {
            if (params[e]) {
                $(`.drawer-menu__${urlFormatter(e)}opened-list-item__arrow-up-icon`).show(200);
                $(`.drawer-menu__${urlFormatter(e)}opened-list-item__arrow-down-icon`).hide(200);
                $(`#drawer-menu_${urlFormatter(e)}-collapse-item`).show(400);
            } else {
                $(`.drawer-menu__${urlFormatter(e)}opened-list-item__arrow-up-icon`).hide(200);
                $(`.drawer-menu__${urlFormatter(e)}opened-list-item__arrow-down-icon`).show(200);
                $(`#drawer-menu_${urlFormatter(e)}-collapse-item`).hide(400);
            }
        })
}
function helperOpen() {
    $(".drawer-menu").removeClass("drawer-menu-closed");
    $(".drawer-menu .drawer-menu__list-item__text").show();
    $(".drawer-menu-icon-open").hide();
    $(".drawer-menu-icon-close").show();
    $(".drawer-menu-icon-box").css("visibility", "visible");
}
function helperClose() {
    $(".drawer-menu").addClass("drawer-menu-closed");
    $(".drawer-menu .drawer-menu__list-item__text").hide();
    $(".drawer-menu-icon-open").show();
    $(".drawer-menu-icon-close").hide();
    $(".drawer-menu-icon-box").css("visibility", "visible");
}
export const configureDrawermenu = (prop) => {
    if ($(".drawer-menu-icon-box").length > 0)
        prop === undefined || prop ? helperOpen() : helperClose();
    else {
        setTimeout(() => {
            configureDrawermenu(prop)
        }, 100)
    }
}

export const loadDrawerMenu = (CULTURE) => async (dispatch, getState) => {
    try {
        let res = await DrawerMenu.get(CULTURE)
        let response = await ProfileService.getState({ "key": "drawer_settings" })
        await dispatch({
            type: LOAD_DRAWER_MENU,
            payload: { data: res.data, openTabs: response.data?.drawer_settings?.openTabs, selectedItem: response.data?.drawer_settings?.selectedItem }
        })
        if (window.location.pathname === "/") {
            dispatch(setSelectedDrawerItem({ SHORT_NAME: "Home" }))
            selectDrawerItem("Home");
        } else {
            selectDrawerItem(response.data?.drawer_settings?.selectedItem?.SHORT_LABEL);
        }
        configureSubMenu(response.data?.drawer_settings?.openTabs)
        configureDrawermenu(response.data?.drawer_settings?.openTabs?.Drawer)

    } catch (err) {
        console.log(err);
    }
}

export const setSelectedDrawerItem = (payload) => async (dispatch) => {
    await dispatch({
        type: SET_SELECTED_DRAWER_ITEM,
        payload: payload
    })
    await dispatch(uploadDrawerSettings())
}


export const setOpenTab = (itemId) => async dispatch => {
    await dispatch({
        type: DRAWER_MENU_SET_OPEN,
        payload: itemId
    })
    dispatch(uploadDrawerSettings())
}

const uploadDrawerSettings = () => async (dispatch, getState) => {
    try {
        const selectedItem = getState().drawerMenu.selectedItem
        const openTabs = getState().drawerMenu.openTabs
        await ProfileService.updateProfileSettings({ drawer_settings: { selectedItem, openTabs } })
        return true
    } catch {

    }
}

export const selectDrawerItem = (params) => {
    if (params)
        try {
            $(`.drawer-menu__selected-list-item`).toggleClass("drawer-menu__selected-list-item")
            $(`.drawer-menu__${urlFormatter(params)}-list-item`).toggleClass("drawer-menu__selected-list-item")
        } catch (err) {
            console.log(err);
        }
}

export const toggleDrawerSubItem = (params) => dispatch => {
    $(`.drawer-menu__${urlFormatter(params)}opened-list-item__arrow-up-icon`).toggle(200);
    $(`.drawer-menu__${urlFormatter(params)}opened-list-item__arrow-down-icon`).toggle(200);
    $(`#drawer-menu_${urlFormatter(params)}-collapse-item`).slideToggle(400);
    dispatch(setOpenTab(params))
}