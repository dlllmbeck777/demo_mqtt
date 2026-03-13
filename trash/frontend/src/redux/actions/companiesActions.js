import {
    CREATE_COMPANY,
    RETRIEVE_COMPANIES,
    UPDATE_COMPANY,
    DELETE_COMPANY,
    DELETE_ALL_COMPANIES,
} from "./actions";

import CompaniesDataService from "../../services/companies.service";

export const createCompany = (name, short_name, active, operated,
    accounting_id, serial_id,
    registry_id, country, region, subregion, city, contact_name,
    address, email, phone, operator, owner,
    purchaser, transporter, service) => async (dispatch) => {
        try {
            const res = await CompaniesDataService.create({
                name, short_name, active, operated,
                accounting_id, serial_id, registry_id, country, region,
                subregion, city, contact_name, address, email,
                phone, operator, owner, purchaser, transporter, service
            });

            dispatch({
                type: CREATE_COMPANY,
                payload: res.data,
            });

            return Promise.resolve(res.data);
        } catch (err) {
            return Promise.reject(err);
        }
    };

export const retrieveCompanies = () => async (dispatch) => {
    try {
        const res = await CompaniesDataService.getAll();

        dispatch({
            type: RETRIEVE_COMPANIES,
            payload: res.data,
        });
    } catch (err) {
        console.log(err);
    }
};

export const updateCompany = (id, data) => async (dispatch) => {
    try {
        const res = await CompaniesDataService.update(id, data);

        dispatch({
            type: UPDATE_COMPANY,
            payload: data,
        });

        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
};

export const deleteCompany = (id) => async (dispatch) => {
    try {
        await CompaniesDataService.remove(id);

        dispatch({
            type: DELETE_COMPANY,
            payload: { id },
        });
    } catch (err) {
        console.log(err);
    }
};

export const deleteAllCompanies = () => async (dispatch) => {
    try {
        const res = await CompaniesDataService.removeAll();

        dispatch({
            type: DELETE_ALL_COMPANIES,
            payload: res.data,
        });

        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
};

export const findCompaniesByTitle = (title) => async (dispatch) => {
    try {
        const res = await CompaniesDataService.findByTitle(title);

        dispatch({
            type: RETRIEVE_COMPANIES,
            payload: res.data,
        });
    } catch (err) {
        console.log(err);
    }
};