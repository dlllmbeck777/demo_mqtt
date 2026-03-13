import { instance, config } from "../baseApi"


const getAll = (body, cancelToken) => {
    return instance.get(`layer/treemenu`, { ...config(), cancelToken: cancelToken.token });
};

const getItemValues = (body, cancelToken) => {
    return instance.post(
        `layer/treemenu/details/`, body, { ...config(), cancelToken: cancelToken.token }
    )
}

const update = (body) => {
    return instance.post(
        "/layer/update/", body, config()
    )
}

const create = (body) => {
    return instance.post(
        "/layer/create/", body, config()
    )
}

const remove = (body) => {
    return instance.post(
        "/layer/delete/", body, config()
    )
}


const databases = (body) => {
    return instance.post(
        "/code-list/layer/db/", body, config()
    )
}
const kubernetes = (text) => {
    return instance.get(
        `/code-list/layer/db/engine/${text}/`, config()
    )
}


const elasticSearch = (text, body, cancelToken) => {
    return instance.post(`/layer/es/`, body, { ...config(), cancelToken: cancelToken.token });
};


const ProjectService = {
    getAll,
    getItemValues,
    create,
    update,
    remove,
    databases,
    kubernetes,
    elasticSearch,
};

export default ProjectService;