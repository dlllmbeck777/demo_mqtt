import axios from "axios";
import { instance, config } from "../baseApi"

const getAllTreeitem = (body, cancelToken) => {
    return instance.post("/resources-types/parent/", body, { ...config(), cancelToken: cancelToken.token });
};

let cancelToken;
const getResourcelistDetail = (body) => {
    if (cancelToken) {
        cancelToken.cancel()
    }
    cancelToken = axios.CancelToken.source();
    return instance.post("/resources-types/get/", body, { ...config(), cancelToken: cancelToken.token });
};

const getResourcelist = (body) => {
    return instance.post("/resources-types/get/", body, config());
};

const create = (body) => {
    return instance.post("/resources-types/create/", body, config());
};

const update = (body) => {
    return instance.post("/resources-types/update/", body, config());
};

const removeChild = (body) => {
    return instance.post("/resources-types/delete/", body, config());
};
const remove = (body) => {
    return instance.post("/resources-types/delete/parent/", body, config());
};

const details = (body) => {
    return instance.post("/resources-types/details/", body, config());
};

const getItemPropCode = (body) => {
    return instance.post("resources-types/property-code/", body, config());
};

const getErrorMessage = (layer, body) => {
    return instance.post(`resources-types/message/${layer}/`, body, config());
};

const elasticSearch = (text, body, cancelToken) => {
    return instance.post(`/resources-types/es/`, body, { ...config(), cancelToken: cancelToken.token });
};


const resourceList = {
    getAllTreeitem,
    getResourcelistDetail,
    getResourcelist,
    update,
    create,
    remove,
    removeChild,
    details,
    getItemPropCode,
    getErrorMessage,
    elasticSearch
};


export default resourceList;

