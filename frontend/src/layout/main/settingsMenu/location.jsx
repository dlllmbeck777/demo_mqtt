import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MenuItem, Box, Divider } from "@mui/material";

import DoneIcon from "@mui/icons-material/Done";
import MenuItems from "./menuItem";

const Location = ({ changeMenu, handleClose, menuItem }) => {
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
          <MenuItem key={e.CODE_TEXT}>
            <Box className="settings-container__main-menu__item-icon-box">
              {"Canada" === e.CODE_TEXT && <DoneIcon />}
            </Box>
            {e.CODE_TEXT.charAt(0).toUpperCase() + e.CODE_TEXT.slice(1)}
          </MenuItem>
        );
      })}
    </>
  );
};

export default Location;
