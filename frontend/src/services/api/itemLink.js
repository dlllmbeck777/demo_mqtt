import { instance, config } from "../baseApi"

const hierarchy = () => {
    return instance.get("/item-link/hierarchy/", config());
};

const getLinkSchema = (body, cancelToken) => {
    return instance.post("/type-link/schema/", body, { ...config(), cancelToken: cancelToken.token });
};

const getRelated = (body, cancelToken) => {
    return instance.post("/type-link/related/", body, { ...config(), cancelToken: cancelToken.token });
};

const getItemLink = (body, cancelToken) => {
    return instance.post("/item-link/details/", body, { ...config(), cancelToken: cancelToken.token });
};

const getChekListItems = (body, cancelToken) => {
    return instance.post("/item-link/schema/", body, { ...config(), cancelToken: cancelToken.token });
};

const cardinalityCheck = (body) => {
    return instance.post("/item-link/cardinalty-check/", body, config());
};

const getTags = (body) => {
    return instance.post("/item-link/tags/", body, config())
}

const getItemCalcTags = (body, cancelToken) => {
    return instance.post("/item-link/linked/calcTags/", body, { ...config(), cancelToken: cancelToken.token })
}
const remove = (body) => {
    return instance.post("/item-link/delete/", body, config());
};

const update = (body) => {
    return instance.post("/item-link/update/", body, config());
};

const save = (body) => {
    return instance.post("/item-link/save/", body, config());
};

const elasticSearch = (text, body, cancelToken) => {
    return instance.post(`/item-link/hierarchy/search/`, body, { ...config(), cancelToken: cancelToken.token });
};

const ItemLinkService = {
    hierarchy,
    getLinkSchema,
    getItemLink,
    getTags,
    getItemCalcTags,
    remove,
    update,
    save,
    elasticSearch,
    getRelated,
    getChekListItems,
    cardinalityCheck
};

export default ItemLinkService;