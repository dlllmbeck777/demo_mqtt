import {
    LOAD_TAGS_LABEL,
    SET_TAG_SAVE_VALUES,
    CLEAN_ALL_TAGS,
    FILL_SAVE_VALUES_TAGS,
    LOAD_ITEMS_FOR_TAGLINKS,

} from "../../actions/types"


const initialState = {
    tagValues: [],
    saveValues: {},
    items: [],
};


export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case LOAD_ITEMS_FOR_TAGLINKS:
            return {
                ...state,
                items: payload
            }
        case LOAD_TAGS_LABEL:
            return {
                ...state,
                tagValues: payload
            }
        case SET_TAG_SAVE_VALUES:
            return {
                ...state,
                saveValues: { ...state.saveValues, [payload.key]: payload.value }
            }
        case FILL_SAVE_VALUES_TAGS:
            return {
                ...state,
                saveValues: payload
            }
        case CLEAN_ALL_TAGS:
            return {
                ...state,
                saveValues: {},
                tagValues: [],
            }
        default:
            return {
                ...state
            }
    }
};
