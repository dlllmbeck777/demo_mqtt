import React from 'react';
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';
import Start from '../layout/start/start';

const PublicRoute = () => {
    const auth = useSelector((state) => state.auth.token);
    return !auth ? <Start><Outlet /></Start> : <Navigate to="/" />;
}

export default PublicRoute;