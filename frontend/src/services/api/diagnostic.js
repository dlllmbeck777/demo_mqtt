import { instance, config } from "../baseApi"


const eventAlarm = (page) => {
    return instance.get(`/event/get/paginations/?page=${page}`, config());
};
const diagnosticSnapshot = (body) => {
    return instance.post(`/event/get/`, body, config());
};
const logAlarm = (page) => {
    return instance.get(`/logs/get/paginations/?page=${page}`, config());
};



const DiagnosticService = {
    logAlarm,
    eventAlarm,
    diagnosticSnapshot
};


export default DiagnosticService;
