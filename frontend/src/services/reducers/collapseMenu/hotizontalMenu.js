import {
    ADD_ITEM_HORIZONTAL_MENU,
    ADD_ORG_ITEM_HORIZONTAL_MENU
} from "../../actions/types"

const initialState = {
    menu: {},

};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case ADD_ORG_ITEM_HORIZONTAL_MENU:
            return {
                ...state,
                menu: { ...state.menu, [payload.key]: { ...state.menu?.[payload.key], [payload.subKey]: payload.val } }
            }
        case ADD_ITEM_HORIZONTAL_MENU:
            return {
                ...state,
                menu: { ...state.menu, BATTERY: { ...state.menu?.BATTERY, [payload.key]: { ...state.menu.BATTERY?.[payload.key], [payload.subKey]: payload.val } } }
            }
        default:
            return {
                ...state,
            }
    }
};
