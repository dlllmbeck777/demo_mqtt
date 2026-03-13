import { instance, unAuthConfig } from "../baseApi"

const get = () => {
    return instance.get("/health", unAuthConfig);
};


const DjangoHealtService = {
    get,
};


export default DjangoHealtService;

