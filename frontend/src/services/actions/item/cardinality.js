import ItemLinkService from "../../api/itemLink";

const helperRequest = async (checkedItems, linkType, type) => {
    const promises = checkedItems.map(async (item) => {
        const body = JSON.stringify({
            LINK_TYPE: linkType,
            [type]: item.ITEMS_ID,
        });
        const res = await ItemLinkService.cardinalityCheck(body);
        return res.data;
    });

    const results = await Promise.all(promises);
    return !results.includes(true);
}

const oneToMany = async (checkedItems, linkType, type) => {
    return await helperRequest(checkedItems, linkType, type)
}

const manyToOne = async (checkedItems, linkType, type, selectedItem) => {
    if (checkedItems.length > 1) {
        return false
    }
    return await helperRequest(selectedItem, linkType, type)
}

const oneToOne = async (checkedItems, linkType, type, selectedItem) => {
    if (!await oneToMany(checkedItems, linkType, "FROM_ITEM_ID"))
        return false
    if (!await manyToOne(checkedItems, linkType, "TO_ITEM_ID", selectedItem))
        return false
    return true
}

const cardinalityCheckType = (TYPE, selectedValue, checkedItems, linkType, selectedItemId) => {
    const fromCardinality = selectedValue.FROM_CARDINALITY
    const toCardinality = selectedValue.TO_CARDINALITY
    if (fromCardinality === "*" && toCardinality === "1") {
        if (TYPE === "TO_ITEM_ID")
            return oneToMany(checkedItems, linkType, "FROM_ITEM_ID", [{ ITEMS_ID: selectedItemId }])
        else return manyToOne(checkedItems, linkType, "FROM_ITEM_ID", [{ ITEMS_ID: selectedItemId }])
    }
    else if (fromCardinality === "1" && toCardinality === "*") {
        if (TYPE === "TO_ITEM_ID")
            return manyToOne(checkedItems, linkType, "TO_ITEM_ID", [{ ITEMS_ID: selectedItemId }])
        else return oneToMany(checkedItems, linkType, "TO_ITEM_ID", [{ ITEMS_ID: selectedItemId }])
    }
    else if (fromCardinality === "*" && toCardinality === "*") {
        return true
    }
    else if (fromCardinality === "1" && toCardinality === "1") {
        return oneToOne
    }
}

export const cardinalityCheck = (linkType, type, selectedValue) => async (dispatch, getState) => {
    const checkedItems = getState().checkedList.checkedItems;
    const selectedItemId = getState().treeview.selectedItem.ITEM_ID;
    if (!selectedValue) {
        return false
    }
    return await cardinalityCheckType(type, selectedValue, checkedItems, linkType, selectedItemId)
}
