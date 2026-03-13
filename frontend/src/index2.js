import React from 'react';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './store/configureStore';
import { MainPageSkeleton, ErrorBoundary } from "./components"
import App from './pages/App';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./assets/styles/styles.scss"

const index = () => {
    return <ErrorBoundary>
        <Provider store={store}>
            <PersistGate loading={<MainPageSkeleton />} persistor={persistor} >
                <App />
            </PersistGate>
        </Provider>
    </ErrorBoundary>
}

export default index