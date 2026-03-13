import { instance, config } from "../baseApi"

const readExel = (body) => {
    return instance.post("/loader/get/", body, config());
};

const create = (body) => {
    return instance.post("/loader/create/", body, config());
};


const LoaderService = {
    readExel,
    create
};

export default LoaderService;