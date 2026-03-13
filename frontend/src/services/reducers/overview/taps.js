import {
    FILL_TAPS_OVERVIEW,
    CLEAN_TABS_OVERVIEW,
    SET_WIDGETS_OVERVIEW,
    REFRESH_WIDGETS_OVERVIEW,
    SET_ISCHECKED,
    SET_UPDATE_ISCHECKED,
    SET_SELECT_TAB_ITEM_INDEX,
    SET_TAB_LOADER,
    SET_TAB,
    TOGGLE_STATUS,
    SET_COPY_HANDLE
} from "../../actions/types"


const initialState = {
    titles: [],
    widgets: [],
    selectedIndex: 0,
    refresh: false,
    isActive: false,
    isChecked: {},
    loader: false,
    tabs: [],
    status: false,
    copy: false
};


export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case TOGGLE_STATUS:
            return {
                ...state,
                status: !state.status
            }
        case SET_TAB:
            return {
                ...state,
                titles: payload,
            }
        case SET_TAB_LOADER:
            return {
                ...state,
                loader: payload
            }
        case SET_ISCHECKED:
            return {
                ...state,
                isChecked: payload
            }
        case SET_UPDATE_ISCHECKED:
            return {
                ...state,
                isChecked: {
                    ...state.isChecked,
                    [payload.key]: payload.val
                }
            }
        case REFRESH_WIDGETS_OVERVIEW:
            return {
                ...state,
                refresh: !state.refresh
            }
        case SET_WIDGETS_OVERVIEW:
            return {
                ...state,
                widgets: payload
            }
        case SET_COPY_HANDLE:
            return {
                ...state,
                copy: payload
            }
        case CLEAN_TABS_OVERVIEW:
            return {
                titles: [],
                widgets: [],
                selectedIndex: 0,
                refresh: false,
                isActive: false,
                isChecked: {},
                loader: false,
                copy: false
            }
        case SET_SELECT_TAB_ITEM_INDEX:
            return {
                ...state,
                selectedIndex: payload
            }
        case FILL_TAPS_OVERVIEW:
            return {
                ...state,
                titles: payload.titles,
                widgets: payload.widgets,
                isActive: true,
                selectedIndex: payload.selectedIndex
            }
        default:
            return {
                ...state,
            }
    }
};
