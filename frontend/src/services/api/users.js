import { instance, config } from "../baseApi";

const getAll = () => {
    return instance.get("/auth/user-list/", config());
};

const getLayers = () => {
    return instance.get("/layer/layer-dropdown/", config());
};

const createUser = (body) => {
    return instance.post("/layer/user/create/", body, config());
}

const updateUserLayer = (body) => {
    return instance.post("/auth/user/layer/update/", body, config());
};

const updateUserRole = (body) => {
    return instance.post("/auth/user/role/update/", body, config());
};

const removeUser = (body) => {
    return instance.post("/auth/user/remove/", body, config());
}

const getRoles = () => {
    return instance.get("/roles/get/", config());
}

const Users = {
    getAll,
    getRoles,
    getLayers,
    updateUserLayer,
    updateUserRole,
    removeUser,
    createUser
};


export default Users;