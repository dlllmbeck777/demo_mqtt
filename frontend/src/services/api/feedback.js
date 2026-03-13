import { instance, config } from "../baseApi"


const create = (body) => {
    return instance.post(`feedback/create/`, body, config());
};


const FeedbackService = {
    create,
};

export default FeedbackService;