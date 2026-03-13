import React from 'react';
import axios from "axios";
import {
    SET_COLUMNS_DATAGRID,
    SET_DATAGRID_TYPE
} from "../types"

import ItemService from "../../api/item";

import TextFieldCompiler from "../../../components/datagrid/typeCompiler/fieldCompiler";
import RenderCellCompiler from '../../../components/datagrid/renderCell/renderCellCompiler';

// Fetching Data From Type
let cancelToken;
export const fetchData = async (CULTURE, TYPE) => {
    try {
        if (cancelToken) {
            cancelToken.cancel();
        }
        cancelToken = axios.CancelToken.source();
        let res = await ItemService.getTypeProperty({
            CULTURE,
            TYPE: TYPE,
        }, cancelToken);
        return Promise.resolve(res.data)
    } catch (err) {
        return Promise.reject(err)
    }
}

// Formatting the Data Grid Header
export const formatData = (data, editable = true, useDatagridValue = false, flex = false) => {
    let column = [];
    Promise.all(
        Object.keys(data).map((type) => {
            data[type]?.map((row) => {
                column.push({
                    flex: flex ? parseFloat(row?.DECIMALS) : "auto",
                    field: row?.COLUMN_NAME,
                    headerName: row?.SHORT_LABEL,
                    editable: editable && !(row.READ_ONLY === "True"),
                    cellClassName: !(editable && !(row.READ_ONLY === "True")) && "readOnlyColumn",
                    renderCell: (params) => {
                        return <RenderCellCompiler
                            prop_type={row?.PROPERTY_TYPE}
                            id={params?.id}
                            field={params?.field}
                            mandatory={row?.MANDATORY}
                            code_list={row?.CODE_LIST}
                            value={params.value}
                            useDatagridValue={useDatagridValue}
                            DECIMALS={row?.DECIMALS}
                        />
                    },
                    renderEditCell: (params) => {
                        return <TextFieldCompiler
                            id={params?.id}
                            field={params?.field}
                            code_list={row?.CODE_LIST}
                            prop_type={row?.PROPERTY_TYPE}
                            mandatory={row?.MANDATORY}
                            value={params.value}
                            useDatagridValue={useDatagridValue}
                            type={row?.TYPE}
                            DECIMALS={row?.DECIMALS}
                        />
                    }
                });
            });
        })
    );
    return column
}

// Dispatch Data
export const setDatagridHeaders = (payload) => dispatch => {
    dispatch({
        type: SET_COLUMNS_DATAGRID,
        payload
    })
}
export const setType = (data) => dispatch => {
    let typeRows = [];
    Promise.all(
        Object.keys(data).map((type) => {
            data[type]?.map((row) => {
                typeRows.push(row);
            });
        })
    );
    dispatch({
        type: SET_DATAGRID_TYPE,
        payload: typeRows
    })

}

export const setDatagridColumns = (CULTURE, TYPE) => async dispatch => {
    try {
        let res = await fetchData(CULTURE, TYPE)
        dispatch(setType(res))
        let payload = formatData(res, true, true, false)
        dispatch(setDatagridHeaders(payload))
    } catch (err) {
        dispatch(setDatagridHeaders([]))
    }
}




