import {
    CLEAN_ROLES
} from "../types"

export const cleanRoles = () => dispatch => {
    dispatch({
        type: CLEAN_ROLES
    })
}