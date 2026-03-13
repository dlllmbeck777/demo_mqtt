function returnValCheck(val) {
    return val === undefined ? false : val
}
export const isRead = (param) => (dispatch, getState) => {
    const isRead = getState().auth.user?.role?.PROPERTY_ID[param]?.READ
    return isRead
}

export const isDeleted = (param) => (dispatch, getState) => {
    const isDeleted = getState().auth.user?.role?.PROPERTY_ID[param]?.DELETE
    return isDeleted
}

export const isNewDeleted = (param) => (dispatch, getState) => {
    const isDeleted = getState().auth.user?.role?.PROPERTY_ID[param]?.DELETE
    const isCreated = getState().auth.user?.role?.PROPERTY_ID[param]?.CREATE
    const isNew = getState().treeview.selectedItem.selectedIndex === -2
    if (isNew && isCreated) {
        return true
    } else {
        return returnValCheck(isDeleted)
    }
}

export const isCreated = (param) => (dispatch, getState) => {
    const isCreated = getState().auth.user?.role?.PROPERTY_ID[param]?.CREATE
    return returnValCheck(isCreated)
}

export const isUpdated = (param) => (dispatch, getState) => {
    const isUpdated = getState().auth.user?.role?.PROPERTY_ID[param]?.UPDATE
    return returnValCheck(isUpdated)
}

export const isNewUpdated = (param) => (dispatch, getState) => {
    const isUpdated = getState().auth.user?.role?.PROPERTY_ID[param]?.UPDATE
    const isCreated = getState().auth.user?.role?.PROPERTY_ID[param]?.CREATE
    const isNew = getState().treeview.selectedItem.selectedIndex === -2
    if (isNew && isCreated) {
        return true
    } else {
        return returnValCheck(isUpdated)
    }
}