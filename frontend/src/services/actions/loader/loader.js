import {
    CHAGE_VALUES_LOADER,
    CLEAN_LOADER,
    SET_DG_HELPER_LAODER
} from "../types"
import LoaderService from "../../api/loader"
import TypeService from "../../api/type"
import { setRowsDatagrid } from "../datagrid/rows"
export const changeValues = (key, value) => dipatch => {
    dipatch({
        type: CHAGE_VALUES_LOADER,
        payload: { key, value }
    })
}

export const cleanLoader = () => dipatch => {
    dipatch({
        type: CLEAN_LOADER,
    })
}

export const readExel = () => async (dispatch, getState) => {
    const values = getState()?.loaderPage?.values

    try {
        dispatch({
            type: SET_DG_HELPER_LAODER,
            payload: values
        })
        const formData = new FormData();
        Object.keys(values)?.map(e => {
            formData.append(e, values?.[e])
        })
        let res = await LoaderService.readExel(formData)
        res.data.map((e, i) => {
            e.id = i
        })
        dispatch(setRowsDatagrid(res.data))
    } catch (err) {
        console.log(err);
    }
}


export const loaderSave = () => async (dispatch, getState) => {
    const rows = getState().datagrid?.rows
    const dgHelper = getState().loaderPage?.dgHelper
    try {
        let res = await TypeService.getParent({ TYPE: dgHelper?.TYPE })
        let data = []
        rows.forEach(e => {
            const { id, ...rest } = e;
            data.push(rest);
        });
        let val = await LoaderService.create(JSON.stringify({
            PROP_TBL_NAME: res.data.PROP_TBL_NAME,
            data
        }))
    } catch (err) {
        console.log(err);
    }

}