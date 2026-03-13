import {
    LOAD_COLLAPSABLE_MENU_ITEMS,
    SET_SELECTED_COLLAPSE_MENU_ITEM,
    CLEAN_COLLAPSE_MENU,
    SET_COLLAPSE_FILTER_MENU
} from "../../actions/types"



const initialState = {
    filerMenu: [],
    menuItems: [],
    selectedItem: null
};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case LOAD_COLLAPSABLE_MENU_ITEMS:
            return {
                ...state,
                menuItems: payload
            }
        case SET_COLLAPSE_FILTER_MENU:
            return {
                ...state,
                filerMenu: payload
            }
        case SET_SELECTED_COLLAPSE_MENU_ITEM:
            return {
                ...state,
                selectedItem: payload
            }
        case CLEAN_COLLAPSE_MENU:
            return {
                ...state,
                menuItems: [],
                selectedItem: null
            }
        default:
            return {
                ...state,
            }
    }
};
