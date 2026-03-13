import { instance, config } from "../baseApi"

const get = (culture) => {
    return instance.get(`/resource-drawer/get/${culture}/`, config());
};
const DrawerMenu = {
    get,
};

export default DrawerMenu;