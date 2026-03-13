// assets
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
// constant
const icons = { GridViewRoundedIcon, AnalyticsOutlinedIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Monitoring',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.GridViewRoundedIcon,
            breadcrumbs: false
        },
        {
            id: 'analytics',
            title: 'Analytics',
            type: 'item',
            url: '/dashboard/analytics',
            icon: icons.AnalyticsOutlinedIcon,
            breadcrumbs: false
        },

    ]
};

export default dashboard;
