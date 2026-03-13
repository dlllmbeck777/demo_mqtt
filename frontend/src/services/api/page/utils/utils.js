import { instance, unAuthConfig } from "../../../baseApi"

const unAuthResourceItem = (body) => {
    return instance.post("/resources-types/get/label/", body, unAuthConfig);
};

const anAuthMenu = (culture, body) => {
    return instance.post(`/code-list/get/language/settings/${culture}/`, body, unAuthConfig);
};

const pageText = (screen, body) => {
    return instance.post(`/resources-types/get/${screen}/`, body, unAuthConfig);
};



const UtilsServices = {
    unAuthResourceItem,
    anAuthMenu,
    pageText,
};


export default UtilsServices;

