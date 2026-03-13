import { lazy } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import Loadable from '../ui-component/Loadable'

//Administration 
const Analytics = Loadable(lazy(() => import('../pages/analytics/analytics.component')));
const Companys = Loadable(lazy(() => import('../pages/administration/models/companys/companys.component')));
const CompanyEdit = Loadable(lazy(() => import('../pages/administration/models/companys/companyEdit/companyEdit.component')));
const CompanyAdd = Loadable(lazy(() => import('../pages/administration/models/companys/companyAdd/companyAdd.component')));
const Profile = Loadable(lazy(() => import('../pages/profile/profile.component')))
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/dashboard.component')))

const MainRoutes = {
    path: '/',
    element: <AdminLayout />,
    children: [
        {
            path: '/dashboard/default',
            element: <Dashboard />
        },
        {
            path: '/dashboard/analytics',
            element: <Analytics />
        },

        //Administration
        {
            path: '/configuration/companies/',
            element: <Companys />
        },
        {
            path: '/configuration/companies/add',
            element: <CompanyAdd />
        },
        {
            path: '/configuration/companies/:id',
            element: <CompanyEdit />
        },
        {
            path: '/profile/:id',
            element: <Profile />
        }

    ]
};

export default MainRoutes;