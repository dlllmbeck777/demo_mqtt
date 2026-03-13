import React, { useEffect } from "react";

import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';


import history from "../routers/history";
import { loadUser } from "../services/actions/auth";

import { setSelectedDrawerItem } from "../services/actions/drawerMenu/drawerMenu";
import { MainPageSkeleton } from "../components";
import Main from '../layout/main/main';

const PrivateRoute = () => {
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth.token);
    const [isLoaded, setIsloaded] = React.useState(false)
    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(loadUser()).then(() => {
                setIsloaded(true)
            })
        }
        else {
            setIsloaded(true)
        }
    }, [])
    return auth ? isLoaded ? <Main Element={<Outlet />} /> : <MainPageSkeleton /> : <Navigate to="/home" />;
}

export default PrivateRoute;