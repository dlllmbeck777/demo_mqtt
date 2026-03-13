import React from "react";
import { MenuItem, Divider, Box } from "@mui/material";

import * as Icons from "@mui/icons-material";
import { useSelector } from "react-redux";

import history from "../../routers/history";
import MenuItems from "../main/settingsMenu/menuItem";
import NestedMenuItem from "../main/settingsMenu/nestedMenuItem";
const MainMenu = ({ changeMenu, handleClose, menuItems }) => {
  const APPEARANCE = useSelector((state) => state.theme.theme);
  const LANGUAGE = useSelector((state) => state.lang.lang);
  const LOCATION = "Canada";

  let values = {
    APPEARANCE,
    LANGUAGE,
    LOCATION,
  };
  return menuItems.map((e, i) => {
    const { [e?.CHAR1]: Icon } = Icons;

    return (
      <>
        {e.VAL2 && <Divider sx={{ my: 1 }} />}

        <Box key={i}>
          {e?.CHILD?.length > 0 && e?.CODE !== "SETTINGS" ? (
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
          ) : (
            <MenuItem
              onClick={() => {
                history.push(`/${e?.CODE.toLowerCase()}`);
                handleClose();
              }}
            >
              <MenuItems Icon={Icon} text={e?.CODE_TEXT} />
            </MenuItem>
          )}
          {e.VAL2 && <Divider />}
        </Box>
      </>
    );
  });
};

export default MainMenu;
