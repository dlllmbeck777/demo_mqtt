import { combineReducers } from "redux";
import authReducer from "./authReducer";
import messageReducer from './messageReducer'
import customizationReducer from "./customizationReducer";
import companiesReducer from './companiesReducer'

const rootReducer = combineReducers({

    customization: customizationReducer,
    messageReducer,
    companiesReducer,
    authReducer
});

export default rootReducer