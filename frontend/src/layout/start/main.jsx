import React from "react";
import { useSelector } from "react-redux";

import { Grid, Menu, Button } from "@mui/material";
import "../../assets/styles/layouts/settingsMenu.scss";
import MainMenu from "./mainMenus";
import Appearance from "../main/settingsMenu/appearance";
import Languages from "../main/settingsMenu/language";
import Location from "../main/settingsMenu/location";
import Settings from "../main/settingsMenu/settings";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import UtilsServices from "../../services/api/page/utils/utils";
const Main = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuName, setMenuName] = React.useState("MAIN");
  const [menuItems, setMenuItems] = React.useState([]);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuName("MAIN");
  };
  const changeMenu = (menuName) => {
    setMenuName(menuName);
  };
  async function asyncFunc() {
    let res = await UtilsServices.anAuthMenu(CULTURE, { PARENT: ["UNAUTH"] });
    setMenuItems(res.data);
  }

  React.useEffect(() => {
    asyncFunc();
  }, [CULTURE]);

  return (
    <Grid item className="settings-container">
      <Grid
        container
        alignItems="center"
        columnSpacing={1.5}
        onClick={handleMenu}
      >
        <Grid item>
          <Button
            sx={{
              color: "#ffffff",
            }}
          >
            <SettingsOutlinedIcon
              sx={{ width: { md: "21px", lg: "27px", xl: "30px" } }}
            />
            <KeyboardArrowDownIcon
              sx={{
                fontSize: { md: "15px", lg: "21px", xl: "24" },
                display: anchorEl ? "none" : "auto",
              }}
            />
            <KeyboardArrowUpIcon
              sx={{
                fontSize: { md: "15px", lg: "21px", xl: "24" },
                display: !anchorEl ? "none" : "auto",
              }}
            />
          </Button>
        </Grid>
      </Grid>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{
          paper: "settings-container__main-menu",
        }}
      >
        {menuName === "MAIN" && (
          <MainMenu
            changeMenu={changeMenu}
            menuItems={menuItems}
            handleClose={handleClose}
          />
        )}
        {menuName === "APPEARANCE" && (
          <Appearance
            changeMenu={changeMenu}
            menuItem={menuItems?.filter((e) => e.CODE === "APPEARANCE")?.[0]}
            handleClose={handleClose}
          />
        )}
        {menuName === "LANGUAGE" && (
          <Languages
            changeMenu={changeMenu}
            menuItem={menuItems?.filter((e) => e.CODE === "LANGUAGE")?.[0]}
            handleClose={handleClose}
          />
        )}
        {menuName === "LOCATION" && (
          <Location
            changeMenu={changeMenu}
            menuItem={menuItems?.filter((e) => e.CODE === "LOCATION")?.[0]}
            handleClose={handleClose}
          />
        )}
        {menuName === "SETTINGS" && (
          <Settings
            changeMenu={changeMenu}
            menuItem={menuItems?.filter((e) => e.CODE === "SETTINGS")}
            handleClose={handleClose}
          />
        )}
      </Menu>
    </Grid>
  );
};

export default Main;
