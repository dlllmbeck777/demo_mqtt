import {
    LOAD_CHECKLIST,
    SET_CHECKED_ITEMS,
    CLEAN_COMPANY_CHECKED_LIST
} from "../types"
import axios from "axios";

import { dateFormatter } from "../../utils/dateFormatter"
import ItemLinkService from "../../api/itemLink";
import { uuidv4 } from "../../utils/uuidGenerator"

let cancelToken;
export const loadCheckedList = (itemType, type) => async (dispatch, getState) => {
    const layer = getState().auth.user.active_layer
    if (cancelToken) {
        cancelToken.cancel()
    }
    cancelToken = axios.CancelToken.source();
    try {
        const selectedItemId = getState().treeview.selectedItem.ITEM_ID;
        const body = JSON.stringify({
            [type === "TO_TYPE" ? "FROM_ITEM_ID" : "TO_ITEM_ID"]: selectedItemId,
            [type === "TO_TYPE" ? "TO_ITEM_TYPE" : "FROM_ITEM_TYPE"]: itemType,
            LAYER_NAME: layer
        })
        let res = await ItemLinkService.getChekListItems(body, cancelToken)
        dispatch({
            type: LOAD_CHECKLIST,
            payload: res.data
        })
    } catch (err) {
        console.log(err);
    }
}

export const toggleChecked = (data) => async (dispatch) => {
    dispatch({
        type: SET_CHECKED_ITEMS,
        payload: data
    })
}

export const saveLinks = async (date, linkType, TO_TYPE, FROM_TYPE, refresh) => async (dispatch, getState) => {
    const checkedItems = getState().checkedList.checkedItems
    const selectedItem = getState().treeview.selectedItem
    let body = []
    const saveFunc = async () => {
        for (let i = 0; i < checkedItems.length; i++) {
            var isOut = false
            if (TO_TYPE === selectedItem.ITEM_TYPE) {
                isOut = true
            }
            const linkUuid = uuidv4();
            const rowUuid = uuidv4();
            body.push({
                LINK_ID: linkUuid.replace(/-/g, ""),
                LINK_TYPE: linkType,
                START_DATETIME: dateFormatter(date),
                END_DATETIME: "9000-1-1",
                FROM_ITEM_ID: isOut ? checkedItems[i].ITEMS_ID : selectedItem.ITEM_ID,
                FROM_ITEM_TYPE: isOut ? FROM_TYPE : selectedItem.ITEM_TYPE,
                TO_ITEM_ID: isOut ? selectedItem.ITEM_ID : checkedItems[i].ITEMS_ID,
                TO_ITEM_TYPE: isOut ? selectedItem.ITEM_TYPE : TO_TYPE,
                ROW_ID: rowUuid.replace(/-/g, ""),
            });
        }
        try {
            body = JSON.stringify(body)

            await ItemLinkService.save(body)
        } catch (err) {
        }
        dispatch(cleanCompanyCheckedList());
        refresh()
        return true
    };
    dispatch({
        type: "confirmation/setConfirmation",
        payload: {
            title: "Are you sure you want to save?",
            body: <>{checkedItems.map((e) => <div>{e.PROPERTY_STRING}</div>)}</>,
            agreefunction: saveFunc,
        },
    });
}

export const cleanCompanyCheckedList = () => dispatch => {
    dispatch({
        type: CLEAN_COMPANY_CHECKED_LIST
    })
}


