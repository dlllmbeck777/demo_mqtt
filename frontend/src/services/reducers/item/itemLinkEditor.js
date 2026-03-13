import {
    LOAD_LINK_EDITOR_SCHEMA_ITEM,
    SET_IS_LINK_ACTIVE,
    UPDATE_LINKS_VALUE,
    CLEAN_LINKS_VALUE,
    TOGGLE_ITEM_LINK_REFRESH
} from "../../actions/types"

const initialState = {
    linkEditorSchema: false,
    linkEditorSchemaFromType: false,
    links: false,
    isLinksActive: false,
    refresh: false
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case CLEAN_LINKS_VALUE:
            return {
                ...state,
                links: false
            }
        case UPDATE_LINKS_VALUE:
            return {
                ...state,
                links: { ...state.links, ...payload }
            }
        case SET_IS_LINK_ACTIVE:
            return {
                ...state,
                isLinksActive: payload
            }
        case TOGGLE_ITEM_LINK_REFRESH:
            return {
                ...state,
                refresh: !state.refresh
            }
        case LOAD_LINK_EDITOR_SCHEMA_ITEM:
            return {
                ...state,
                linkEditorSchema: payload.toType,
                linkEditorSchemaFromType: payload.fromType
            }
        default:
            return {
                ...state,
            }
    }
};
