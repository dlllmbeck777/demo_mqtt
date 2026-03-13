import { useSelector } from "react-redux";
import { grey } from "@material-ui/core/colors"

const Palette = () => {
    const theme = useSelector((state) => state.theme.theme);
    let palette = {}
    switch (theme) {
        case "light":
            palette = {
                mode: "light",
                primary: {
                    light: "#cfd8dc",
                    main: "#212121", // moved tree-menu-text
                    dark: "#819ca9", //moved bg-app-header
                },

                success: {
                    primary: "#607d8b", // moved border-card
                    main: "#676767", // selected item for light
                    secondary: "#e0e0e0", // moved bg-drawer
                    info: "#eeeeee",//dg readonly bg

                },

                text: {
                    primary: "#364868", // moved text-drawer-item
                    main: "#546e7a", // moved text-drawer-selected-item
                    secondary: "#616161", // moved card-title
                    success: "#9e9e9e", //card info text
                    info: "#37474f",
                    blue: "#002984"


                },


                background: {
                    primary: "#b0bec5", // moved bg-drawer-selected-item
                    main: "#eeeeee", // moved bg-all
                    secondary: "#e0e0e0", // nested menu background
                    success: "#e0e0e0", // moved bg-card
                    info: "#eceff1", //properties bg
                },


                hover: {
                    primary: "#cfd8dc", // moved bg-drawer-selected-item-hover
                    main: "#f44336",
                    secondary: "#00897b", // moved border-card-hover
                    success: "#e0e0e0",// button hover
                },

                icon: {
                    primary: "#819ca9", //moved tree menü icon
                    secondary: "#263238", // moved action menu icon
                    main: "#819ca9", //seachbar icon
                    success: "#9fa8da", // moved action menu icon 
                },


                status: {
                    main: "#efebe9", //moved tree menu bg
                    primary: "#424242", // items text
                    secondary: "#37474f", // item text lvl2
                    success: "#e0e0e0", // search bar
                    info: "#cfd8dc", //search bar hover
                },

                chart: {
                    main: "#cfd8dc"
                },

                deneme: {
                    main: "#ff3d00",
                },



                myBackgroundColor: "#ffffff",
                myTreeViewBg: "#ffffff",
                myCanvasBg: "#FAFCFF",
                myTextColor: "#42526E",
                myReverseText: "#ffffff",
                myCardFancyColor: "#42526E",
                myCardFancyColorHover: "#458BF3",
                myBoldText: "#364868",
                myLightText: "#7B809A",
            }
            break
        case "dark":
            palette = {
                mode: "dark",
                primary: {
                    light: "#ffffff",
                    main: "#ffffff",
                    dark: "#212121", // DarkHeader
                },

                success: {
                    primary: "#424242", // card fancy dark color
                    main: "#ffffff", //selected item for dark
                    secondary: "#424242", // drawer bg for dark
                    info: "#616161"
                },

                text: {
                    primary: "#ffffff", // drawer menu text for dark
                    main: "#eceff1", // select item for drawer text for dark
                    secondary: "#eeeeee", // card header text for dark
                    success: "#e0e0e0", //card info text for dark
                    info: "#424242",
                    blue: "#33eaff"

                },

                background: {
                    primary: "#616161", //  drawer menu select item background for dark
                    main: "#757575", //  paper background for dark
                    secondary: "#616161", //nested menu dark background
                    success: "#9e9e9e", // card bg dark
                    info: "#616161", //properties bg
                },

                icon: {
                    primary: "#ffffff", //items icon
                    main: "#37474f", //searchbar icon
                    secondary: "#ffffff", // items under icon
                    success: "#5c6bc0", // icon hover text 
                },



                status: {
                    main: "#616161", //items 
                    primary: "#e0e0e0", // items text
                    secondary: "#e0e0e0", //item text lvl2
                    success: "#9e9e9e", // search bar
                    info: "#bdbdbd", //search bar hover

                },


                hover: {
                    primary: "#757575", // nested menu hover for dark
                    main: "#f44336",
                    secondary: "#607d8b", // card hover for dark
                    success: "#bdbdbd",//button hover
                },

                chart: {
                    main: "#ffffff"
                },

                deneme: {
                    main: "#ff3d00",
                },


                myBackgroundColor: "#424242",
                myTreeViewBg: "#9E9E9E",
                myCanvasBg: "black",
                myTextColor: "#BB86FC",
                myReverseText: "#000000",
                myCardFancyColor: grey[800],
                myCardFancyColorHover: grey[600],
                myBoldText: "#364868",
                myLightText: "#7B809A",
            }
            break
        case "temp":
            palette = {
                mode: "light",
                primary: {
                    light: "#cfd8dc",
                    main: "#616161", // typography
                    dark: "#ffffff", //header
                },

                success: {
                    primary: "#43a047", // card fancy color
                    main: "#676767", // selected item for light
                    secondary: "#ffffff", // drawer menu bacground
                    info: "#eeeeee",

                },

                text: {
                    primary: "#424242", // drawer menu text
                    main: "#000000", // select item for drawer text
                    secondary: "#616161", // card header text
                    success: "#9e9e9e", //card info text
                    info: "#37474f",
                    blue: "#002984"


                },


                background: {
                    primary: "#e1dde2", // drawer menu select item background
                    main: "#f8f1f9", // paper background
                    secondary: "#ffffff", // nested menu background
                    success: "#ffffff", // card Background
                    info: "#eceff1", //properties bg
                },


                hover: {
                    primary: "#dad5db", // nested menu hover
                    main: "#f44336",
                    secondary: "#66bb6a", // card fancy hover
                    success: "#e0e0e0",// button hover
                },

                icon: {
                    primary: "#424242", //items icon
                    secondary: "#263238", // items under icon
                    main: "#f5f5f5", //seachbar icon
                    success: "#9fa8da", // icon hover text 
                },


                status: {
                    main: "#f5eff6", //items bg
                    primary: "#424242", // items text
                    secondary: "#37474f", // item text lvl2
                    success: "#ffffff", // search bar
                    info: "#fafafa", //search bar hover
                },

                chart: {
                    main: "#cfd8dc"
                },

                deneme: {
                    main: "#ff3d00",
                },



                myBackgroundColor: "#ffffff",
                myTreeViewBg: "#ffffff",
                myCanvasBg: "#FAFCFF",
                myTextColor: "#42526E",
                myReverseText: "#ffffff",
                myCardFancyColor: "#42526E",
                myCardFancyColorHover: "#458BF3",
                myBoldText: "#364868",
                myLightText: "#7B809A",
            }
            break
        case "tempDark":
            palette = {
                mode: "dark",
                primary: {
                    light: "#ffffff",
                    main: "#AEAAAE",
                    dark: "#1C1B1E", // DarkHeader
                },

                success: {
                    primary: "#605D62", // card fancy dark color
                    main: "#ffffff", //selected item for dark
                    secondary: "#1C1B1E", // drawer bg for dark
                    info: "#323033"
                },

                text: {
                    primary: "#AEAAAE", // drawer menu text for dark
                    main: "#ffffff", // select item for drawer text for dark
                    secondary: "#eeeeee", // card header text for dark
                    success: "#e0e0e0", //card info text for dark
                    info: "#424242",
                    blue: "#33eaff"

                },

                background: {
                    primary: "#605D62", //  drawer menu select item background for dark
                    main: "#000000", //  paper background for dark
                    secondary: "#323033", //nested menu dark background and main box bg
                    success: "#323033", // card bg dark
                    info: "#323033", //properties bg
                },

                icon: {
                    primary: "#ffffff", //items icon
                    main: "#37474f", //searchbar icon
                    secondary: "#ffffff", // items under icon
                    success: "#5c6bc0", // icon hover text 
                },



                status: {
                    main: "#323033", //items 
                    primary: "#e0e0e0", // items text
                    secondary: "#e0e0e0", //item text lvl2
                    success: "#1C1B1E", // search bar
                    info: "#48464A", //search bar hover

                },


                hover: {
                    primary: "#616161", // nested menu hover for dark
                    main: "#f44336",
                    secondary: "#607d8b", // card hover for dark
                    success: "#bdbdbd",//button hover
                },

                chart: {
                    main: "#ffffff"
                },

                deneme: {
                    main: "#ff3d00",
                },


                myBackgroundColor: "#424242",
                myTreeViewBg: "#9E9E9E",
                myCanvasBg: "black",
                myTextColor: "#BB86FC",
                myReverseText: "#000000",
                myCardFancyColor: grey[800],
                myCardFancyColorHover: grey[600],
                myBoldText: "#364868",
                myLightText: "#7B809A",
            }
            break
        case "temp2":
            palette = {
                mode: "light",
                primary: {
                    light: "#cfd8dc",
                    main: "#616161", // typography
                    dark: "#ffffff", //header
                },

                success: {
                    primary: "#43a047", // card fancy color
                    main: "#676767", // selected item for light
                    secondary: "#ffffff", // drawer menu bacground
                    info: "#eeeeee",

                },

                text: {
                    primary: "#424242", // drawer menu text
                    main: "#000000", // select item for drawer text
                    secondary: "#616161", // card header text
                    success: "#9e9e9e", //card info text
                    info: "#37474f",
                    blue: "#002984"


                },


                background: {
                    primary: "#e1dde2", // drawer menu select item background
                    main: "#f8f1f9", // paper background
                    secondary: "#ffffff", // nested menu background
                    success: "#ffffff", // card Background
                    info: "#eceff1", //properties bg
                },


                hover: {
                    primary: "#dad5db", // nested menu hover
                    main: "#f44336",
                    secondary: "#66bb6a", // card fancy hover
                    success: "#e0e0e0",// button hover
                },

                icon: {
                    primary: "#424242", //items icon
                    secondary: "#263238", // items under icon
                    main: "#f5f5f5", //seachbar icon
                    success: "#9fa8da", // icon hover text 
                },


                status: {
                    main: "#f5eff6", //items bg
                    primary: "#424242", // items text
                    secondary: "#37474f", // item text lvl2
                    success: "#ffffff", // search bar
                    info: "#fafafa", //search bar hover
                },

                chart: {
                    main: "#cfd8dc"
                },

                deneme: {
                    main: "#ff3d00",
                },



                myBackgroundColor: "#ffffff",
                myTreeViewBg: "#ffffff",
                myCanvasBg: "#FAFCFF",
                myTextColor: "#42526E",
                myReverseText: "#ffffff",
                myCardFancyColor: "#42526E",
                myCardFancyColorHover: "#458BF3",
                myBoldText: "#364868",
                myLightText: "#7B809A",
            }
            break
        case "tempDark2":
            palette = {
                mode: "dark",
                primary: {
                    light: "#ffffff",
                    main: "#ffffff",
                    dark: "#1C1B1E", // DarkHeader
                },

                success: {
                    primary: "#605D62", // card fancy dark color
                    main: "#ffffff", //selected item for dark
                    secondary: "#1C1B1E", // drawer bg for dark
                    info: "#323033"
                },

                text: {
                    primary: "#ffffff", // drawer menu text for dark
                    main: "#ffffff", // select item for drawer text for dark
                    secondary: "#ffffff", // card header text for dark
                    success: "#e0e0e0", //card info text for dark
                    info: "#424242",
                    blue: "#33eaff"

                },

                background: {
                    primary: "#605D62", //  drawer menu select item background for dark
                    main: "#000000", //  paper background for dark
                    secondary: "#323033", //nested menu dark background and main box bg
                    success: "#323033", // card bg dark
                    info: "#323033", //properties bg
                },

                icon: {
                    primary: "#ffffff", //items icon
                    main: "#37474f", //searchbar icon
                    secondary: "#ffffff", // items under icon
                    success: "#5c6bc0", // icon hover text 
                },



                status: {
                    main: "#323033", //items 
                    primary: "#e0e0e0", // items text
                    secondary: "#e0e0e0", //item text lvl2
                    success: "#1C1B1E", // search bar
                    info: "#48464A", //search bar hover

                },


                hover: {
                    primary: "#616161", // nested menu hover for dark
                    main: "#f44336",
                    secondary: "#607d8b", // card hover for dark
                    success: "#bdbdbd",//button hover
                },

                chart: {
                    main: "#ffffff"
                },

                deneme: {
                    main: "#ff3d00",
                },


                myBackgroundColor: "#424242",
                myTreeViewBg: "#9E9E9E",
                myCanvasBg: "black",
                myTextColor: "#BB86FC",
                myReverseText: "#000000",
                myCardFancyColor: grey[800],
                myCardFancyColorHover: grey[600],
                myBoldText: "#364868",
                myLightText: "#7B809A",
            }
            break
        default:
            break
    }

    return (
        palette
    )
}

export default Palette

