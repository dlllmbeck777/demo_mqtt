import {
    CHANGE_PAGE
} from "../../actions/types"

const initialState = {
    page: "properties"
};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case CHANGE_PAGE:
            return {
                ...state,
                page: payload
            }
        default:
            return {
                ...state,
            }
    }
};
