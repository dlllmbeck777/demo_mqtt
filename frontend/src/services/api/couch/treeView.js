import { config, instance } from "../../couchApi"

const get = (userId) => {
    return instance.get(`/treeviewstate/${userId}`, config);
};

const update = (userId, body) => {
    return instance.put(`/treeviewstate/${userId}`, body, config);
};

const create = (body) => {
    return instance.post(`/treeviewstate`, body, config);
};

const TreeView = {
    get,
    update,
    create
};

export default TreeView;