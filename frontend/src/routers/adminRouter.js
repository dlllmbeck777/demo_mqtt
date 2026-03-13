import React from 'react';
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';


const AdminRoute = () => {
    const auth = useSelector((state) => state.auth.user.is_admin);

    return auth ? <Outlet /> : <Navigate to="/service" />;
}

export default AdminRoute;