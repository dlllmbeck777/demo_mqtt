import { instance, config } from "../baseApi"

const getDashboards = (body, cancelToken) => {
    return instance.post("/dashboard/get/", body, { ...config(), cancelToken: cancelToken.token });
};

const dashBoardUserGet = (body) => {
    return instance.post("/dashboard/user/get/", body, config());
};

const dashboardUpdatePerm = (body) => {
    return instance.post("/dashboard/user/update/", body, config());
};

const updateDashboards = (body) => {
    return instance.post("/dashboard/save/", body, config());
};

const removeDashboards = (body) => {
    return instance.post("/dashboard/delete/", body, config());
};
const dublicateDashboard = (body) => {
    return instance.post("/dashboard/dublicate/", body, config());
};
const getWidgetTypeList = () => {
    return instance.get("/code-list/widget-type/", config());
};

const getWidgetProps = (body) => {
    return instance.post("/widgets-type/get/", body, config());
};

const getWidget = (body) => {
    return instance.post("/widget-property/get/", body, config());
};

const createWidget = (body) => {
    return instance.post("/widgets/save/", body, config());
};

const removeWidget = (body) => {
    return instance.post("/widgets/delete/", body, config());
};

const updateWidget = (body) => {
    return instance.post("/widget-property/update/", body, config());
};

const layoutUpdate = (body) => {
    return instance.post("/layouts/update/", body, config());
};

const pasteOneDash = (body) => {
    return instance.post("/dashboard/copy/", body, config());
};

const deleteAllTab = (body) => {
    return instance.post("/dashboard/deleteAll/", body, config());
};


const anomaly = (body) => {
    return instance.post("/widgets/get/anomaly/", body, config());
};

const Overview = {
    getDashboards,
    dashBoardUserGet,
    dashboardUpdatePerm,
    updateDashboards,
    removeDashboards,
    getWidgetTypeList,
    getWidgetProps,
    getWidget,
    createWidget,
    removeWidget,
    updateWidget,
    layoutUpdate,
    dublicateDashboard,
    pasteOneDash,
    deleteAllTab,
    anomaly
};


export default Overview;

