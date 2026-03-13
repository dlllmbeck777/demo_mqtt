import axios from "axios";
import { instance, config } from "../baseApi"

const getAll = (body, cancelToken) => {
    return instance.get("/tags/details/", { ...config(), cancelToken: cancelToken.token });
};
let cancelToken;
const getTagItem = (body) => {
    if (cancelToken) {
        cancelToken.cancel()
    }
    cancelToken = axios.CancelToken.source();
    return instance.post("/tags/item/", body, { ...config(), cancelToken: cancelToken.token });
};

const getTagItemS = (body) => {
    return instance.post("/tags/item/", body, { ...config() });
};

const getFft = (body, layer) => {
    return instance.post(`/tags/fft/${layer}/`, body, { ...config() });
};
const getFftByAsset = (body, layer) => {
    return instance.post(`/tags/fft/by/asset/${layer}/`, body, { ...config() });
};

const getFftWave = (body, layer) => {
    return instance.post(`/tags/timewaveform/${layer}/`, body, { ...config() });
};

const getRms = (body, layer) => {
    return instance.post(`/tags/visulations/data/${layer}/`, body, { ...config() });
};

const getRmsAcc = (body, layer) => {
    return instance.post(`tags/accleraions-rms/${layer}/`, body, { ...config() });
};

const getTagsProperty = (body) => {
    return instance.post("/type/details/", { ...body, TYPE: "TAG_INFO" }, config());
};

const createAndUpdate = (body) => {
    return instance.post("/tags/save/", body, config());
};

const remove = (body) => {
    return instance.post("/tags/delete/", body, config());
};

const workflow = (body) => {
    return instance.post(`/tags/item/tags/`, body, config());
}

const lineChartData = (tagId) => {
    return instance.get(`/tags/graph/live/${tagId}/`, config());
}

const tabularLiveData = (tagId) => {
    return instance.get(`/tags/graph/tabular/live/${tagId}/`, config());
}

const getShortName = (body) => {
    return instance.post(`/tags/get/asset/`, body, config());
}
const elasticSearch = (text, body, cancelToken) => {
    return instance.get(`/tags/es/${text}`, { ...config(), cancelToken: cancelToken.token });
};

const TagService = {
    elasticSearch,
    getAll,
    getFft, getFftByAsset,
    getFftWave,
    getRmsAcc,
    getRms,
    getTagItemS,
    getTagItem,
    getTagsProperty,
    createAndUpdate,
    workflow,
    lineChartData,
    tabularLiveData,
    getShortName,
    remove
};


export default TagService;