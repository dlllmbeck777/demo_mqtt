import axios from "axios";
import { instance, config } from "../baseApi"

const getAll = (body, cancelToken) => {
    return instance.post("/uom-unit/type/", body, { ...config(), cancelToken: cancelToken.token });
};

const getAllNoToken = (body) => {
    return instance.post("/uom-unit/type/", body, config());
};

const getUom = (body, cancelToken) => {
    return instance.get(`/uom/type/${body}/`, { ...config(), cancelToken: cancelToken.token });
};

const getUomNoToken = (body) => {
    return instance.get(`/uom/type/${body}/`, config());
};

const create = (body) => {
    return instance.post("/uom/create/", body, config());
};

const update = (body) => {
    return instance.post("/uom/update/", body, config());
};

const remove = (body) => {
    return instance.post("/uom/delete/", body, config());
};

const removeQt = (body) => {
    return instance.get(`/uom/delete/quantity/${body}/`, config());
};

const getUomCode = (body) => {
    return instance.post(`/uom/get/by/code/`, body, config());
};

const elasticSearch = (text, body, cancelToken) => {
    return instance.post(`/uom/es/`, body, { ...config(), cancelToken: cancelToken.token });
};

const UomService = {
    getAll,
    getAllNoToken,
    getUom,
    getUomNoToken,
    create,
    update,
    remove,
    removeQt,
    getUomCode,
    elasticSearch,

};


export default UomService;