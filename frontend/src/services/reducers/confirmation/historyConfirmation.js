import {
    SET_IS_ACTIVE_CONFIRMATION,
    SET_SAVE_FUNCTION_CONFIRMATION,
    SET_BODY_CONFIRMATION,
    SET_TITLE_CONFIRMATION,
    SET_GO_FUNCTION_CONFIRMATION,
    SET_IS_OPEN_CONFIRMATION,
    SET_CLEAN_CONFIRMATION
} from "../../actions/types"



const initialState = {
    isActive: false,
    okfunction: () => { },
    title: "",
    body: "",
    gofunction: () => { },
    isOpen: false
};



export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case SET_IS_ACTIVE_CONFIRMATION:
            return {
                ...state,
                isActive: payload
            }
        case SET_SAVE_FUNCTION_CONFIRMATION:
            return {
                ...state,
                okfunction: payload
            }
        case SET_TITLE_CONFIRMATION:
            return {
                ...state,
                title: payload
            }
        case SET_BODY_CONFIRMATION:
            return {
                ...state,
                body: payload
            }
        case SET_GO_FUNCTION_CONFIRMATION:
            return {
                ...state,
                gofunction: payload
            }
        case SET_IS_OPEN_CONFIRMATION:
            return {
                ...state,
                isOpen: payload
            }
        case SET_CLEAN_CONFIRMATION:
            return {
                ...state,
                isActive: false,
                isOpen: false
            }
        default:
            return {
                ...state,
            }
    }
};

