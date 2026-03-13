import {
    CLEAN_ROLES,
    LOAD_ROLES_PROPERTY,
    UPDATE_ROLES_NAME_PROPERTY,
} from "../../actions/types"


const initialState = {
    roles: {
        "ROLES_ID": "",
        "ROLES_NAME": "",
        "LAYER_NAME": "",
        "LAST_UPDATE_USER": ""
    },
};

export default function (state = initialState, action) {

    const { type, payload } = action;

    switch (type) {

        case LOAD_ROLES_PROPERTY: {
            return {
                ...state,
                roles: payload,
            }
        }
        case UPDATE_ROLES_NAME_PROPERTY: {
            return {
                ...state,
                roles: { ...state.roles, ROLES_NAME: payload },
            }
        }
        case CLEAN_ROLES: {
            return {
                roles: {
                    "ROLES_ID": "",
                    "ROLES_NAME": "",
                    "LAYER_NAME": "",
                    "LAST_UPDATE_USER": ""
                },
            }
        }
        default:
            return {
                ...state,
            }
    }
};
