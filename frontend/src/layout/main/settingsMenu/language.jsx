import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MenuItem, Box, Divider } from "@mui/material";

import DoneIcon from "@mui/icons-material/Done";
import MenuItems from "./menuItem";
import {
  changeLanguage,
  changeLangs,
} from "../../../services/actions/language";
import UtilsServices from "../../../services/api/page/utils/utils";
import { changeTheme } from "../../../services/actions/theme";

const ChangeTemp = ({ changeMenu, handleClose, menuItem }) => {
  const dispatch = useDispatch();
  const activeLang = useSelector((state) => state.lang.cultur);
  const theme = useSelector((state) => state.theme.theme);
  const langSelect = async (language) => {
    try {
      let res = await UtilsServices.anAuthMenu(language.CODE, {
        PARENT: ["UNAUTH", "AUTH"],
      });
      let val = res.data?.filter((e) => e.CODE === "LANGUAGE")?.[0];
      let item = val?.CHILD?.filter((e) => e.CODE === language.CODE)?.[0];
      if (item?.CODE && item?.CODE_TEXT) {
        dispatch(changeLanguage(item?.CODE));
        dispatch(changeLangs(item?.CODE_TEXT));
        dispatch(changeTheme(theme));
      }
    } catch (err) {
      console.log(err);
    }
    // setTimeout(() => {
    //   window.location.reload();
    // }, 500);
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
      {menuItem.CHILD.map((e, i) => {
        return (
          <MenuItem
            key={i}
            onClick={() => {
              langSelect(e);
            }}
          >
            <Box className="settings-container__main-menu__item-icon-box">
              {activeLang === e.CODE && <DoneIcon />}
            </Box>
            {e.CODE_TEXT.charAt(0).toUpperCase() + e.CODE_TEXT.slice(1)}
          </MenuItem>
        );
      })}
    </>
  );
};

export default ChangeTemp;
