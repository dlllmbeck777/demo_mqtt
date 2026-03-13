import {
    CREATE_COMPANY,
    RETRIEVE_COMPANIES,
    UPDATE_COMPANY,
    DELETE_COMPANY,
    DELETE_ALL_COMPANIES,
} from "../actions/actions";

const initialState = [];

const companyReducer = (company = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case CREATE_COMPANY:
            return [...company, payload];

        case RETRIEVE_COMPANIES:
            return payload;

        case UPDATE_COMPANY:
            return company.map((companyItem) => {
                if (companyItem.id === payload.id) {
                    return {
                        ...companyItem,
                        ...payload,
                    };
                } else {
                    return company;
                }
            });

        case DELETE_COMPANY:
            return company.filter(({ id }) => id !== payload.id);

        case DELETE_ALL_COMPANIES:
            return [];

        default:
            return company;
    }
};

export default companyReducer;