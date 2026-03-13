import React from "react";
import { MenuItem, Divider, Box } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import * as Icons from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FeedbackOutlinedIcon from "@mui/icons-material/FeedbackOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TranslateIcon from "@mui/icons-material/Translate";
import Brightness2OutlinedIcon from "@mui/icons-material/Brightness2Outlined";
import LanguageIcon from "@mui/icons-material/Language";
import { useDispatch, useSelector } from "react-redux";
import history from "../../../routers/history";

import MenuItems from "./menuItem";
import NestedMenuItem from "./nestedMenuItem";
import { logout } from "../../../services/actions/auth";
import { setLoaderTrue } from "../../../services/actions/loader";
const MainMenu = ({ changeMenu, handleClose, menuItems }) => {
  const dispatch = useDispatch();
  const APPEARANCE = useSelector((state) => state.theme.themeText);
  const user = useSelector((state) => state.auth.user);
  const LANGUAGE = useSelector((state) => state.lang.lang);
  const LOCATION = "Canada";
  const layer = useSelector((state) => state.auth.user?.active_layer);
  let values = {
    APPEARANCE,
    LANGUAGE,
    LOCATION,
  };
  return menuItems.map((e, i) => {
    const { [e?.CHAR1]: Icon } = Icons;
    if (e?.CHILD?.length > 0 && e?.CODE !== "SETTINGS")
      return (
        <MenuItem
          onClick={() => {
            changeMenu(e?.CODE);
          }}
        >
          <NestedMenuItem
            Icon={Icon}
            text={`${e?.CODE_TEXT} : ${values[e?.CODE]} `}
          />
        </MenuItem>
      );
    else if (e.CODE === "USER_PROFILE")
      return (
        <>
          <MenuItem
            onClick={() => {
              history.push("/administration/profile");
              handleClose();
            }}
          >
            <MenuItems
              Icon={AccountCircleIcon}
              text={user?.first_name + " " + user?.last_name}
            />
          </MenuItem>
          <Divider />
        </>
      );
    else if (e.CODE === "LAYER")
      return (
        <>
          <MenuItem
            onClick={() => {
              changeMenu("LAYER");
            }}
          >
            <NestedMenuItem
              Icon={LanguageIcon}
              text={`${e.CODE_TEXT} : ${layer}`}
            />
          </MenuItem>
          <Divider />
        </>
      );
    else if (e.CODE === "SETTINGS")
      return (
        <>
          <MenuItem
            onClick={() => {
              changeMenu("SETTINGS");
            }}
          >
            <NestedMenuItem Icon={Icon} text={`${e.CODE_TEXT}`} />
          </MenuItem>
          <Divider />
        </>
      );
    else if (e.CODE === "SIGN_OUT")
      return (
        <>
          <Divider />
          <MenuItem
            onClick={() => {
              dispatch(logout());
              dispatch(setLoaderTrue());
              handleClose();
            }}
          >
            <MenuItems Icon={ExitToAppIcon} text={e.CODE_TEXT} />
          </MenuItem>
        </>
      );
    return (
      <MenuItem
        onClick={() => {
          history.push(`/${e?.CODE.toLowerCase()}`);
        }}
      >
        <MenuItems Icon={Icon} text={e?.CODE_TEXT} />
      </MenuItem>
    );
  });
};

export default MainMenu;
