import { configureStore, combineReducers } from '@reduxjs/toolkit'
import logger from 'redux-logger'


import storage from 'redux-persist/lib/storage';


import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

import {
    alarms,
    authReducer,
    checkedList,
    confirmation,
    collapseMenu,
    diagnostic,
    historyConfirmation,
    datagrid,
    dataGridType,
    drawerMenu,
    errorReducer,
    feedback,
    horizontalMenu,
    loader,
    project,
    profile,
    itemDataGrid,
    itemLinkEditor,
    langReducer,
    loaderReducer,
    overviewDialog,
    propLinkTap,
    registerFormReducer,
    roles,
    searchBarReducer,
    stepper,
    tags,
    tapsOverview,
    themeReducer,
    treeview,
} from '../services/reducers'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["lang"]
}

const rootReducer = combineReducers({
    auth: authReducer,
    alarms: alarms,
    checkedList: checkedList,
    confirmation: confirmation,
    collapseMenu: collapseMenu,
    diagnostic: diagnostic,
    datagrid: datagrid,
    historyConfirmation: historyConfirmation,
    dataGridType: dataGridType,
    drawerMenu: drawerMenu,
    error: errorReducer,
    feedback: feedback,
    horizontalMenu: horizontalMenu,
    loaderPage: loader,
    project: project,
    profile: profile,
    itemDataGrid: itemDataGrid,
    itemLinkEditor: itemLinkEditor,
    lang: langReducer,
    loader: loaderReducer,
    overviewDialog: overviewDialog,
    propLinkTap: propLinkTap,
    registerForm: registerFormReducer,
    roles: roles,
    searchBar: searchBarReducer,
    stepper: stepper,
    tags: tags,
    tapsOverview: tapsOverview,
    theme: themeReducer,
    treeview: treeview,
})


const persistedReducer = persistReducer(persistConfig, rootReducer)
const enableReduxLogger = process.env.REACT_APP_ENABLE_REDUX_LOGGER === "true";

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: [
                    "confirmation.agreefunction",
                    "confirmation.extrafunction",
                    "historyConfirmation.okfunction",
                    "historyConfirmation.gofunction",
                ],
                ignoredActionPaths: ["payload", "payload.agreefunction", "payload.extrafunction"],
            },
        }).concat(enableReduxLogger ? [logger] : []),
});

export const persistor = persistStore(store);
