import { instance, config, unAuthConfig } from "../baseApi"
import axios from "axios";
const getAll = (body, cancelToken) => {
    return instance.post("/type/all/", body, { ...config(), cancelToken: cancelToken.token });
};


const getParentType = (body, cancelToken) => {
    return instance.post("/type/get/types/", body, { ...config(), cancelToken: cancelToken.token });
};

const getParent = (body) => {
    return instance.post("/type/get/types/", body, config());
};

let cancelToken;
const getTypeAndProperty = (body) => {
    if (cancelToken) {
        cancelToken.cancel()
    }
    cancelToken = axios.CancelToken.source();
    return instance.post("/type/editor/", body, { ...config(), cancelToken: cancelToken.token });
};

const createUpdateType = (body) => {
    return instance.post("/type/save-editor/", body, config());
};

const createUpdateProperty = (body) => {
    return instance.post("/type-property/save-update/", body, config());
};

const deleteType = (body) => {
    return instance.post("/type/delete/", body, config());
};

const deleteProperty = (body) => {
    return instance.post("/type-property/delete/", body, config());
};

const workflow = (body) => {
    return instance.post("/type/workflows/", body, config());
};

const getItemRead = (item) => {
    return instance.get(`type-ref/get/${item}/read/`, config());
};
const getItemReadWid = (id) => {
    return instance.get(`type-ref/get/${id}/`, config());
};


const getTransaction = (item) => {
    return instance.get(`type-ref/get/${item}/transactions/`, config());
};


const elasticSearch = (text, body, cancelToken) => {
    return instance.post(`/type/es/`, body, { ...config(), cancelToken: cancelToken.token });
};


const TypeService = {
    getAll,
    getParentType,
    getParent,
    getTypeAndProperty,
    createUpdateType,
    createUpdateProperty,
    deleteType,
    deleteProperty,
    workflow,
    getItemRead,
    getTransaction,
    getItemReadWid,
    elasticSearch,

};


export default TypeService;