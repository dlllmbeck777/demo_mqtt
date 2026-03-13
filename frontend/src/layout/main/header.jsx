import * as React from "react";
import $ from "jquery";
import { useDispatch } from "react-redux";

import { Grid, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";

import AlertIcon from "./alert/alarmsIcon";
import Menu from "./settingsMenu/main";
import history from "../../routers/history";
import { setOpenTab } from "../../services/actions/drawerMenu/drawerMenu";
import ConnectivityIcon from "./alert/connectivityIcon";

const Header = () => {
  const dispatch = useDispatch();
  function handleClick() {
    $(".drawer-menu").toggleClass("drawer-menu-closed");
    $(".drawer-menu .drawer-menu__list-item__text").toggle(200);
    $(".drawer-menu-icon-open").toggle();
    $(".drawer-menu-icon-close").toggle();
    dispatch(setOpenTab("Drawer"));
  }
  return (
    <Grid container className="app-header">
      <Grid item className="app-header-box">
        <Grid container className="app-header__left-box">
          <Grid item className="drawer-menu-icon-box">
            <IconButton onClick={handleClick}>
              <MenuIcon className="drawer-menu-icon-open drawer-menu-icon" />
              <MenuOpenOutlinedIcon className="drawer-menu-icon drawer-menu-icon-close" />
            </IconButton>
          </Grid>
          <Grid item>
            <Box
              className="app-header__left-box__app-logo"
              onClick={() => {
                history.push("/");
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container className="app-header__right-box">
          <AlertIcon />
          <ConnectivityIcon />
          <Menu />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(Header);
