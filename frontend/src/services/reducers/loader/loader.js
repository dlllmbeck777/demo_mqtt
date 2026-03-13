import {
    CHAGE_VALUES_LOADER,
    CLEAN_LOADER,
    CHANGE_ROWS_LOADER,
    SET_DG_HELPER_LAODER
} from "../../actions/types"


const initialState = {
    values: {},
    rows: [],
    dgHelper: {}
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case CHAGE_VALUES_LOADER: {
            return {
                ...state,
                values: { ...state.values, [payload?.key]: payload.value },
            }
        }
        case SET_DG_HELPER_LAODER: {
            return {
                ...state,
                dgHelper: payload,
            }
        }
        case CHANGE_ROWS_LOADER: {
            return {
                ...state,
                rows: payload,
            }
        }
        case CLEAN_LOADER: {
            return {
                ...state,
                rows: [],
                values: {},
                dgHelper: {}
            }
        }
        default:
            return {
                ...state,
            }
    }
};
