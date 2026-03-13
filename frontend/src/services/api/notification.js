import { instance, config } from "../baseApi"

const allNotificationsReaded = () => {
    return instance.get("/event/update/all/", config());
};

const notificationsReaded = (id) => {
    return instance.get(`/event/update/${id}/`, config());
};

const NotificationsService = {
    notificationsReaded,
    allNotificationsReaded,

};

export default NotificationsService;