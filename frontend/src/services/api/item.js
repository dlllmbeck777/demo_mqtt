import { instance, config } from "../baseApi"


const getAll = (body, cancelToken, type) => {
    return instance.get(`/item/details/${type}`, { ...config(), cancelToken: cancelToken.token });
};

const getTypeProperty = (body, cancelToken) => {
    return instance.post(
        "/type/details/", body, { ...config(), cancelToken: cancelToken.token }
    )
}

const getTypePropertyNoToken = (body) => {
    return instance.post(
        "/type/details/", body, config()
    )
}

const getItemValues = (body, cancelToken) => {
    return instance.post(
        "/item-property/details/", body, { ...config(), cancelToken: cancelToken.token }
    )
}

const update = (body) => {
    return instance.post(
        "/item/item-and-property/", body, config()
    )
}

const create = (body) => {
    return instance.post(
        "/item/create/", body, config()
    )
}

const remove = (body) => {
    return instance.post(
        "/item/delete/", body, config()
    )
}
const removeColumns = (body) => {
    return instance.post(
        "/item-property/delete/columns/", body, config()
    )
}
const hierarchStatusGet = (body) => {
    return instance.post(
        "/item-event/get/", body, config()
    )
}
const chartStatusGet = (body) => {
    return instance.post(
        "/item-event/get/columns/all/", body, config()
    )
}
const hierarchStatusUpdate = (body) => {
    return instance.post(
        "/item-event/save/status/", body, config()
    )
}

const formSave = (body) => {
    return instance.post(
        "/item-event/save/", body, config()
    )
}

const formUpdate = (body) => {
    return instance.post(
        "/item-event/update/", body, config()
    )
}

const formDelete = (body) => {
    return instance.post(
        "/item-event/delete/", body, config()
    )
}

const getDowntimeDG = (body) => {
    return instance.post("/item-event/get/downtime/", body, config())
}

const calendar = (body, cancelToken) => {
    return instance.post("/item-event/get/dt/", body, { ...config(), cancelToken: cancelToken.token })
}
const getTransactionPagination = (culture, item_id, event_type, page_size, page) => {
    console.log(`/item-event/get/downtime/paginations/${culture}/${item_id}/${event_type}/?page=${page}`);
    return instance.get(`/item-event/get/downtime/paginations/${culture}/${item_id}/${event_type}/${page_size}/?page=${page}`, config())
}

const elasticSearch = (text, body, cancelToken) => {
    return instance.post(`/item-property/es/`, body, { ...config(), cancelToken: cancelToken.token });
};


const ItemService = {
    getAll,
    getTypeProperty,
    getItemValues,
    getTypePropertyNoToken,
    create,
    update,
    remove,
    removeColumns,
    hierarchStatusGet,
    hierarchStatusUpdate,
    elasticSearch,
    getDowntimeDG,
    formSave,
    chartStatusGet,
    formDelete,
    getTransactionPagination,
    formUpdate,
    calendar
};

export default ItemService;