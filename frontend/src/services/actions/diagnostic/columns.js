import React from "react";

import CodelistService from "../../api/codeList";
import { formatData } from "../datagrid/columns";
import ItemService from "../../api/item";

export const system_health = async (CULTURE) => {
    let res = await ItemService.getTypePropertyNoToken({
        CULTURE,
        TYPE: "SYSTEM_HEALTH",
    });
    let columns = formatData(res.data, false, false, true)
    return columns
}

export const communicationsStatus = async (CULTURE) => {
    let res = await ItemService.getTypePropertyNoToken({
        CULTURE,
        TYPE: "WARNING",
    });
    let columns = formatData(res.data, false, false, true)
    return columns
}


export const logs_column = async (CULTURE) => {
    let res = await ItemService.getTypePropertyNoToken({
        CULTURE,
        TYPE: "LOGS",
    });
    let columns = formatData(res.data, false, false, true)
    return columns
}


export const alarmHistory = async (CULTURE) => {
    let res = await ItemService.getTypePropertyNoToken({
        CULTURE,
        TYPE: "ALARMS",
    });
    let columns = formatData(res.data, false, false, true)

    let val = {}
    try {
        val = await CodelistService.getByParentHierarchy({
            CULTURE,
            LIST_TYPE: "DATA_ALARMS_CODE",
        });
        console.log(val);
    } catch (err) {
        console.log(err);
    }
    columns.map(e => {
        console.log(e);
        if (e.field === "error_message") {
            e.renderCell = (params) => {
		return <>{params?.row?.error_message}</>
                //return <>{params?.row?.short_name} {"("}{params?.row?.interval}{")"},{val?.data?.filter(e => e.CODE === "Value")?.[0]?.CODE_TEXT} : {params?.row?.tag_value} {val?.data?.filter(e => e.CODE === params?.row?.gap_type)?.[0]?.CODE_TEXT} : {params?.row?.gap}</>
            }
        }
    })
    return columns
}

