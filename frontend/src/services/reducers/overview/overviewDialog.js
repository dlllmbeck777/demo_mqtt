import {
    FILL_VALUES_OVERVIEW_DIALOG,
    CHANGE_VALUE_OVERVIEW_DIALOG,
    SET_SELECT_ITEM_OVERVIEW_DIALOG,
    SET_HIGHCHART_PROPERTY_OVERVIEW_DIALOG,
    SET_MEASUREMENT_DATA,
    SET_ITEM_DATA_OVERVIEW,
    SET_FORM_SELECT_ITEM_OVERVIEW_DIALOG
} from "../../actions/types"



const initialState = {
    selectItems: [{

    }],
    values: {

    },
    highchartProps: {

    },
    measuremenetData: [],
    itemData: [],
    formSelectItems: [{
        CODE_TEXT: "",
        CODE: "",
    }]

};


export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {
        case SET_FORM_SELECT_ITEM_OVERVIEW_DIALOG:
            return {
                ...state,
                formSelectItems: payload
            }
        case SET_ITEM_DATA_OVERVIEW:
            return {
                ...state,
                itemData: payload
            }
        case SET_MEASUREMENT_DATA:
            return {
                ...state,
                measuremenetData: payload
            }
        case SET_HIGHCHART_PROPERTY_OVERVIEW_DIALOG:
            return {
                ...state,
                highchartProps: payload
            }
        case SET_SELECT_ITEM_OVERVIEW_DIALOG:
            return {
                ...state,
                selectItems: payload
            }
        case FILL_VALUES_OVERVIEW_DIALOG:
            return {
                ...state,
                values: payload
            }
        case CHANGE_VALUE_OVERVIEW_DIALOG:
            return {
                ...state,
                highchartProps: {
                    ...state.highchartProps, [payload.key]: payload.value
                }
            }
        default:
            return {
                ...state
            }
    }
};
