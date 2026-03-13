import { instance, config } from "../baseApi"
import axios from "axios";
const loadProfileSettings = () => {
    return instance.get("/user-settings/get/all/", config());
};

const updateProfileSettings = (body) => {
    return instance.post("/user-settings/update/", body, config());
};

const updateSettings = (body, cancelToken) => {
    return instance.post("/user-settings/update/", body, { ...config(), cancelToken: cancelToken.token });
};

const getState = (body) => {
    return instance.post("/user-settings/get/state/", body, config());
};
let cancelToken;
const getStateWCancel = (body) => {
    if (cancelToken) {
        cancelToken.cancel()
    }
    cancelToken = axios.CancelToken.source();
    return instance.post("/user-settings/get/state/", body, { ...config(), cancelToken: cancelToken.token });
};

const ProfileService = {
    loadProfileSettings,
    updateProfileSettings,
    updateSettings,
    getState,
    getStateWCancel
};


export default ProfileService;

