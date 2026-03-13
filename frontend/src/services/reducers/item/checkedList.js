import {
    LOAD_CHECKLIST,
    SET_CHECKED_ITEMS,
    CLEAN_COMPANY_CHECKED_LIST

} from "../../actions/types"

const initialState = {
    listItem: [],
    checkedItems: []
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case LOAD_CHECKLIST:
            return {
                ...state,
                listItem: payload
            }
        case CLEAN_COMPANY_CHECKED_LIST:
            return {
                ...state,
                listItem: [],
                checkedItems: []
            }
        case SET_CHECKED_ITEMS:
            return {
                ...state,
                checkedItems: payload
            }
        default:
            return {
                ...state,
            }
    }
};
