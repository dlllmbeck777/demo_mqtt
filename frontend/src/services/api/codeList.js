import axios from "axios";
import { instance, config, unAuthConfig } from "../baseApi"

const getAllTreeitem = (body, cancelToken) => {
    return instance.post("/code-list/details/parent/", body, { ...config(), cancelToken: cancelToken.token });
};

let cancelToken;
const getCodelistDetail = (body) => {
    if (cancelToken) {
        cancelToken.cancel()
    }
    cancelToken = axios.CancelToken.source();
    return instance.post("/code-list/deep-details/", body, { ...config(), cancelToken: cancelToken.token });
};

const remove = (body) => {
    return instance.post("/code-list/delete/", body, config());
};

const getItemPropCode = (body) => {
    return instance.post("code-list/property-code/", body, config());
};

const getByParentHierarchy = (body) => {
    return instance.post("/code-list/get/by/request/", body, config());
};

const getCultures = () => {
    return instance.get("/code-list/culture/");
};

const elasticSearch = (text, body, cancelToken) => {
    return instance.post(`/code-list/es/`, body, { ...config(), cancelToken: cancelToken.token });
};


const CodelistService = {
    getAllTreeitem,
    getCodelistDetail,
    remove,
    getItemPropCode,
    getByParentHierarchy,
    elasticSearch,
    getCultures
};


export default CodelistService;

