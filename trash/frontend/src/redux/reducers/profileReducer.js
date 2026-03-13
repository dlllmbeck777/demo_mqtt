import {
    CREATE_COMPANY,
    RETRIEVE_COMPANIES,
    UPDATE_COMPANY,
    DELETE_COMPANY,
    DELETE_ALL_COMPANIES,
} from "../actions/actions";

const initialState = [];

const profileReducer = (profile = initialState, action) => {
    const { type, payload } = action;

    switch (type) {


        case UPDATE_COMPANY:
            return profile.map((profileItem) => {
                if (profileItem.id === payload.id) {
                    return {
                        ...profileItem,
                        ...payload,
                    };
                } else {
                    return profile;
                }
            });
        default:
            return profile;
    }
};

export default profileReducer;