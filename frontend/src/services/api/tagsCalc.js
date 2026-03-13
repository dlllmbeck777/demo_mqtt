import axios from "axios";
import { instance, config } from "../baseApi"

const getAll = (body, cancelToken) => {
    return instance.get("/tagsCalc/details/", { ...config(), cancelToken: cancelToken.token });
};
let cancelToken;
const getTagItem = (body) => {
    if (cancelToken) {
        cancelToken.cancel()
    }
    cancelToken = axios.CancelToken.source();
    return instance.post("/tagsCalc/item/", body, { ...config(), cancelToken: cancelToken.token });
};

const getTagsProperty = (body) => {
    return instance.post("/type/details/", { ...body, TYPE: "TAG_CALCULATED" }, config());
};

const createAndUpdate = (body) => {
    console.log(body);
    return instance.post("/tagsCalc/save/", body, config());
};

const remove = (body) => {
    return instance.post("/tagsCalc/delete/", body, config());
};

const elasticSearch = (text, body, cancelToken) => {
    return instance.get(`/tagsCalc/es/${text}`, { ...config(), cancelToken: cancelToken.token });
};


const TagCalcService = {
    elasticSearch,
    getAll,
    getTagItem,
    getTagsProperty,
    createAndUpdate,
    remove,

};


export default TagCalcService;