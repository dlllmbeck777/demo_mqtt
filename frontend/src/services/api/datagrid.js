import { instance, config } from "../baseApi"

const create = (body) => {
    return instance.post("/datagrid/save/", body, config());
};

const DatagridService = {
    create,
};

export default DatagridService;

