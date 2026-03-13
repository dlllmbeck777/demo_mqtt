import {
    FILL_VALUES_OVERVIEW_DIALOG,
    CHANGE_VALUE_OVERVIEW_DIALOG,
    SET_SELECT_ITEM_OVERVIEW_DIALOG,
    SET_HIGHCHART_PROPERTY_OVERVIEW_DIALOG,
    SET_FORM_SELECT_ITEM_OVERVIEW_DIALOG
} from "../types"

import { uuidv4 } from "../../utils/uuidGenerator"
import { loadTapsOverview, updateLayouts } from "./taps"
import Overview from "../../api/overview"
import { add_error } from "../error"
import TypeService from "../../api/type"

export const fillTypeValues = async (WIDGET_TYPE) => async (dispatch, getState) => {
    try {
        const culture = getState().lang.cultur
        const body = JSON.stringify({ WIDGET_TYPE })
        let res = await Overview.getWidgetProps(body)
        let typeProp = {}
        const properties = res.data[0].properties
        Promise.all(
            Object.keys(properties).map(e => {
                typeProp[e] = properties[e]?.[culture]
            })
        )
        dispatch({
            type: FILL_VALUES_OVERVIEW_DIALOG,
            payload: typeProp
        })

        return Promise.resolve(res.data)
    } catch (err) {
        console.log(err);
        return Promise.reject(err)
    }
}

export const fillProperties = async (WIDGET_TYPE) => async (dispatch, getState) => {
    try {
        const culture = getState().lang.cultur
        const body = JSON.stringify({ WIDGET_TYPE })
        let res = await Overview.getWidgetProps(body)
        let chartProp = {}
        let typeProp = {}
        const properties = res.data[0].properties
        Promise.all(
            Object.keys(properties).map(e => {
                chartProp[e] = properties[e].value
                typeProp[e] = properties[e]?.[culture]
            })
        )
        dispatch({
            type: FILL_VALUES_OVERVIEW_DIALOG,
            payload: typeProp
        })
        dispatch({
            type: SET_HIGHCHART_PROPERTY_OVERVIEW_DIALOG,
            payload: chartProp
        })
        return Promise.resolve(res.data)
    } catch (err) {
        console.log(err);
    }
}
export const fetchFormItems = () => async (dispatch, getState) => {
    try {
        const type = getState().collapseMenu.selectedItem?.FROM_ITEM_TYPE
        let res = await TypeService.getTransaction(type)
        return Promise.resolve(res.data)
    } catch (err) {
        return err
    }
}

export const loadFormSelectItems = () => async (dispatch, getState) => {
    const res = await dispatch(fetchFormItems())
    dispatch({
        type: SET_FORM_SELECT_ITEM_OVERVIEW_DIALOG,
        payload: [...res?.filter(e => {
            if (e.TYPE === "DOWNTIME")
                e.CODE = "Downtime"
            if (e.TYPE === "PUMP_READ")
                e.CODE = "Pump Read"
            if (e.TYPE === "COMP_READ")
                e.CODE = "Compressore Read"
            e.CHAR1 = "FormPopUp"
            return e.TYPE === "DOWNTIME" || e.TYPE === "PUMP_READ" || e.TYPE === "COMP_READ"
        })]
    })

}

export const changeValeus = (key, value) => dispatch => {
    dispatch({
        type: CHANGE_VALUE_OVERVIEW_DIALOG,
        payload: { key, value }
    })
}

function getInputsId(props) {
    let returnVal = []
    for (let i = 0; i < props?.length; i++) {
        returnVal.push(props[i].TAG_ID)
    }
    return returnVal
}

const chosePropType = (propName, propType) => {
    if (propType === "boolean") {
        return "PROPERTY_BOOLEAN"
    }
    switch (propName) {
        case "Inputs":
        case "[0] Measurement":
        case "[1] Measurement":
        case "[2] Measurement":
        case "[3] Measurement":
        case "[4] Measurement":
        case "[5] Measurement":
        case "Measurement":
            return "PROPERTY_TAG"
        case "Assets":
        case "Process Defination":
            return "PROPERTY_JSON"
        default:
            return "PROPERTY_STRING"
    }
}

const chosePropValue = (propName, propVal) => {
    switch (propName) {
        case "Inputs":
        case "[0] Measurement":
        case "[1] Measurement":
        case "[2] Measurement":
        case "[3] Measurement":
        case "[4] Measurement":
        case "[5] Measurement":
        case "Measurement":
            return getInputsId(propVal)
        default:
            return propVal
    }
}

const fillTheProperty = (chartProps, widgetId, layer) => {
    let properties = []

    for (let i = 0; i < Object.keys(chartProps).length; i++) {
        properties.push({
            "WIDGET_TYPE": chartProps.type,
            "PROPERTY_NAME": Object.keys(chartProps)[i],
            "LAYER_NAME": layer,
            "START_DATETIME": "2023-01-01",
            "END_DATETIME": "9000-01-01",
            "PROPERTY_TYPE": typeof chartProps[Object.keys(chartProps)[i]],
            [chosePropType(Object.keys(chartProps)[i], typeof chartProps[Object.keys(chartProps)[i]])]: chosePropValue(Object.keys(chartProps)[i], chartProps[Object.keys(chartProps)[i]]),
            "WIDGET_ID": [widgetId.replace(/-/g, "")],
            "ROW_ID": uuidv4().replace(/-/g, "")
        })
    }
    return properties
}

export const saveNewChart = () => async (dispatch, getState) => {
    const chartProps = getState().overviewDialog.highchartProps
    const title = getState().tapsOverview.titles
    const selected = getState().tapsOverview.selectedIndex
    const dashboardId = getState().tapsOverview.widgets[title[selected]].ROW_ID
    const layer = getState().auth.user.active_layer
    const uuid = uuidv4()
    try {
        const WIDGET = {
            WIDGET_ID: uuid.replace(/-/g, ""),
            WIDGET_TYPE: chartProps.Type,
            ROW_ID: uuidv4().replace(/-/g, ""),
            LAYER_NAME: layer
        }
        let PROPERTY = fillTheProperty(chartProps, uuid, layer)
        const DASHBOARD_ID = dashboardId
        const body = JSON.stringify({ WIDGET: WIDGET, PROPERTY: PROPERTY, DASHBOARD_ID: DASHBOARD_ID })
        console.log(JSON.stringify(body));
        await dispatch(updateLayouts())
        let res = await Overview.createWidget(body)
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        dispatch(loadTapsOverview())
    }
    catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        console.log(err);
    }
}

const fillTheUpdateProperty = (chartProps, widgetId, layer) => {
    let properties = []
    for (let i = 0; i < Object.keys(chartProps).length; i++) {
        properties.push({
            "PROPERTY_NAME": Object.keys(chartProps)[i],
            "LAYER_NAME": layer,
            [chosePropType(Object.keys(chartProps)[i], typeof chartProps[Object.keys(chartProps)[i]])]: chosePropValue(Object.keys(chartProps)[i], chartProps[Object.keys(chartProps)[i]]),
            "WIDGET_ID": [widgetId.replace(/-/g, "")],
        })
    }
    return properties
}

export const updateChart = (widgetId, refresh) => async (dispatch, getState) => {
    const chartProps = getState().overviewDialog.highchartProps;
    const layer = getState().auth.user.active_layer
    const body = JSON.stringify({ UPDATE: fillTheUpdateProperty(chartProps, widgetId, layer), DELETE: [] });
    try {
        console.log(body);
        let res = await Overview.updateWidget(body)
        console.log(res);
        dispatch(add_error(res.data?.status_message?.SHORT_LABEL, res.data?.status_code));
        refresh()
    } catch (err) {
        dispatch(add_error(err?.response?.data?.status_message?.SHORT_LABEL, err?.response?.data?.status_code));
        console.log(err);
    }
};

export const cleanStops = (key, value, titles) => (dispatch, getState) => {
    const highchartProps = getState().overviewDialog.highchartProps
    const stopsVal = getState().overviewDialog.highchartProps.Stops
    for (let i = parseInt(stopsVal); i >= parseInt(value); i--) {
        titles.map(e => {
            delete highchartProps[`[${i}] ${e}`]
        })
    }
    dispatch(changeValeus(key, value))
}