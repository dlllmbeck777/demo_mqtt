import {
    ADD_ITEM_HORIZONTAL_MENU,
    ADD_ORG_ITEM_HORIZONTAL_MENU
} from "../types"

const orgItems = ["COMPANY", "ORG_UNIT1", "ORG_UNIT2", "ORG_UNIT3", "ORG_UNIT4", "BATTERY"]

const filterMenuSearch = (items, path) => dispatch => {
    items.map(item => {
        if (!item.FROM_ITEM_TYPE) {
            dispatch({
                type: ADD_ORG_ITEM_HORIZONTAL_MENU,
                payload: { key: "COMPANY", val: { ...item, path: `${path}/${item.FROM_ITEM_NAME.replaceAll("/", "U+002F")}` }, subKey: item.FROM_ITEM_NAME }
            })
        } else if (orgItems.includes(item?.FROM_ITEM_TYPE)) {
            dispatch({
                type: ADD_ORG_ITEM_HORIZONTAL_MENU,
                payload: { key: item.FROM_ITEM_TYPE, val: { ...item, path: `${path}/${item.FROM_ITEM_NAME.replaceAll("/", "U+002F")}` }, subKey: item.FROM_ITEM_NAME }
            })
        } else {
            dispatch({
                type: ADD_ITEM_HORIZONTAL_MENU,
                payload: { key: item.FROM_ITEM_TYPE, val: { ...item, path: `${path}/${item.FROM_ITEM_NAME.replaceAll("/", "U+002F")}` }, subKey: item.FROM_ITEM_NAME }
            })
        }
        if (item.CHILD) dispatch(filterMenuSearch(item.CHILD, `${path}/${item.FROM_ITEM_NAME.replaceAll("/", "U+002F")}`))
    })
}


export const loadHorizontalMenu = () => async (dispatch, getState) => {
    const filterVerticalMenu = getState().collapseMenu.filerMenu
    dispatch(filterMenuSearch(filterVerticalMenu, "overview"))
}

