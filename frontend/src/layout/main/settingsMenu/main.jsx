import React from "react";
import { useSelector } from "react-redux";

import { Grid, Avatar, Menu } from "@mui/material";
import "../../../assets/styles/layouts/settingsMenu.scss";
import UtilsServices from "../../../services/api/page/utils/utils";
import MainMenu from "./mainMenu";
import Appearance from "./appearance";
import Languages from "./language";
import Location from "./location";
import Layer from "./layer";
import Settings from "./settings";
const Main = () => {
  const user = useSelector((state) => state.auth.user);
  const [menuItems, setMenuItems] = React.useState([]);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuName, setMenuName] = React.useState("MAIN");
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
    let res = await UtilsServices.anAuthMenu(CULTURE, {
      PARENT: ["UNAUTH", "AUTH"],
    });
    console.log(res);
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
          <Grid
            className="settings-container__name-role"
            container
            rowGap={0.5}
          >
            <Grid item className="settings-container__name-role__name">
              {user?.first_name}
            </Grid>
            <Grid item className="settings-container__name-role__role">
              {user?.role?.ROLES_NAME} | {user?.active_layer}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Avatar
            alt={user ? user.first_name.concat(" ", user.last_name) : "Unknown"}
            src="/"
          />
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
            handleClose={handleClose}
            menuItems={menuItems}
          />
        )}
        {menuName === "APPEARANCE" && (
          <Appearance
            changeMenu={changeMenu}
            handleClose={handleClose}
            menuItem={menuItems?.filter((e) => e.CODE === "APPEARANCE")?.[0]}
          />
        )}
        {menuName === "LANGUAGE" && (
          <Languages
            changeMenu={changeMenu}
            handleClose={handleClose}
            menuItem={menuItems?.filter((e) => e.CODE === "LANGUAGE")?.[0]}
          />
        )}
        {menuName === "LOCATION" && (
          <Location
            changeMenu={changeMenu}
            handleClose={handleClose}
            menuItem={menuItems?.filter((e) => e.CODE === "LOCATION")?.[0]}
          />
        )}
        {menuName === "LAYER" && (
          <Layer
            changeMenu={changeMenu}
            handleClose={handleClose}
            menuItem={menuItems?.filter((e) => e.CODE === "LAYER")?.[0]}
          />
        )}
        {menuName === "SETTINGS" && (
          <Settings
            changeMenu={changeMenu}
            handleClose={handleClose}
            menuItem={menuItems?.filter((e) => e.CODE === "SETTINGS")?.[0]}
          />
        )}
      </Menu>
    </Grid>
  );
};

export default Main;
