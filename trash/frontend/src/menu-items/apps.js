// // assets
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import SdStorageOutlinedIcon from '@mui/icons-material/SdStorageOutlined';

// constant
const icons = {
    WarningAmberRoundedIcon,
    DescriptionOutlinedIcon,
    ContentCopyRoundedIcon,
    SdStorageOutlinedIcon,
    StorageRoundedIcon
};

// ==============================|| APPS MENU ITEMS ||============================== //

const apps = {
    id: 'Apps',
    title: 'apps',
    type: 'group',
    children: [
        {
            id: 'apps-integraions',
            title: 'Integrations log',
            type: 'item',
            url: '/apps/integrations-log',
            icon: icons.ContentCopyRoundedIcon,
            breadcrumbs: true
        },
        {
            id: 'apps-events',
            title: 'Event log',
            type: 'item',
            url: '/apps/event-log',
            icon: icons.DescriptionOutlinedIcon,
            breadcrumbs: true
        },
        {
            id: 'apps-failure',
            title: 'Failure log',
            type: 'item',
            url: '/apps/failure-log',
            icon: icons.WarningAmberRoundedIcon,
            breadcrumbs: true
        },
        {
            id: 'apps-data',
            title: 'Data log',
            type: 'item',
            url: '/apps/data-log',
            icon: icons.SdStorageOutlinedIcon,
            breadcrumbs: true
        },
        {
            id: 'apps-database',
            title: 'Database ',
            type: 'item',
            url: '/apps/database',
            icon: icons.StorageRoundedIcon,
            breadcrumbs: true
        },
    ]
};

export default apps;
