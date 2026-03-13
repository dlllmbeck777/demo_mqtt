import InventoryIcon from '@mui/icons-material/Inventory';
import LabelImportantRoundedIcon from '@mui/icons-material/LabelImportantRounded';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
const icons = {
    InventoryIcon,
    ArrowRightRoundedIcon
};


const administration = {
    id: 'configuration',
    title: 'Configuration',
    type: 'group',
    children: [{
        id: "objects",
        title: "Objects",
        type: "collapse",
        icon: icons.ArrowRightRoundedIcon,
        children: [{
            id: "сompanys",
            title: "Companys",
            type: "item",
            url: "/configuration/companies",
        }, {
            id: "batterys",
            title: "Batterys",
            type: "item",
        }, {
            id: "fields",
            title: "Fields",
            type: "item",
        }]
    }, {
        id: "dictionaries",
        title: "Dictionaries",
        type: "collapse",
        icon: icons.ArrowRightRoundedIcon,
    }]
};

export default administration;
