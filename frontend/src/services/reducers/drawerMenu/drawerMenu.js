import {
    SET_SELECTED_DRAWER_ITEM,
    LOAD_DRAWER_MENU,
    DRAWER_MENU_SET_OPEN,
} from "../../actions/types"

const initialState = {
    selectedItem: {},
    data: null,
    openTabs: {}
};


export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case DRAWER_MENU_SET_OPEN:
            return {
                ...state,
                openTabs: {
                    ...state.openTabs,
                    [payload]: state?.openTabs?.[payload] === undefined ? false : !state?.openTabs[payload]
                }
            }
        case LOAD_DRAWER_MENU:
            return {
                ...state,
                data: payload.data,
                openTabs: payload.openTabs,
                selectedItem: payload.selectedItem
            }
        case SET_SELECTED_DRAWER_ITEM:
            return {
                ...state,
                selectedItem: payload
            }
        default:
            return {
                ...state,
            }
    }
};
