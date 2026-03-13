
import Dashboard from '../pages/dashboard/dashboard.component'
import MonitoringLayout from '../layouts/MonitoringLayout';




const MonitoringRoutes = {
    path: '/',
    element: <MonitoringLayout />,
    children: [

        {
            path: '/dashboard/default',
            element: <Dashboard />
        },

    ]
};

export default MonitoringRoutes;