import { lazy } from 'react'
import Loadable from '../ui-component/Loadable';
import AuthLayout from '../layouts/AuthLayout'

const Login = Loadable(lazy(() => import('../pages/authentication/authentication3/Login3')))
const Registration = Loadable(lazy(() => import('../pages/authentication/authentication3/Register3')))

const AuthenticationRoutes = {
    path: '/',
    element: <AuthLayout />,
    children: [
        {
            path: '/',
            element: <Login />
        },
        {
            path: '/registration',
            element: <Registration />
        }
    ]
};

export default AuthenticationRoutes;