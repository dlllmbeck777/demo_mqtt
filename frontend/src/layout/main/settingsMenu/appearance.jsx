import React from "react";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";

import { MenuItem, Box, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneIcon from "@mui/icons-material/Done";
import { changeTheme } from "../../../services/actions/theme";
import axios from "axios";
import ProfileService from "../../../services/api/profile";
import MenuItems from "./menuItem";
const ChangeTemp = ({ changeMenu, handleClose, menuItem }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  let themeCancelToken;
  const themeSelect = (theme) => {
    try {
      if (themeCancelToken) {
        themeCancelToken.cancel();
      }
      themeCancelToken = axios.CancelToken.source();
      ProfileService.updateSettings({ thema: theme }, themeCancelToken);
    } catch (err) {
      console.log(err);
    }
    $("#main-box").removeClass().addClass(`theme-${theme}`);
    localStorage.setItem("theme", `theme-${theme}`);
    dispatch(changeTheme(theme));
  };
  return (
    <>
      <MenuItem
        onClick={() => {
          changeMenu("MAIN");
        }}
      >
        <MenuItems Icon={ArrowBackIcon} text={menuItem.CODE_TEXT} />
      </MenuItem>
      <Divider />
      {menuItem.CHILD.map((e) => {
        return (
          <MenuItem
            key={e.CODE_TEXT}
            onClick={() => {
              themeSelect(e.CHAR1.charAt(0).toLowerCase() + e.CHAR1.slice(1));
            }}
          >
            <Box className="settings-container__main-menu__item-icon-box">
              {theme === e.CHAR1.charAt(0).toLowerCase() + e.CHAR1.slice(1) && (
                <DoneIcon />
              )}
            </Box>
            {e.CODE_TEXT}
          </MenuItem>
        );
      })}
    </>
  );
};

export default ChangeTemp;
