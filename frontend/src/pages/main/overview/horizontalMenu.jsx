import React from "react";
import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

import MyMenu from "./myMenu";
import MyMenuItems from "./myMenuItems";

const HorizontalMenu = () => {
  const menuItems = useSelector((state) => state.horizontalMenu?.menu);

  return (
    <Grid
      container
      columnGap={2}
      className="overview-container__horizontal-menu__body__item"
    >
      {Object.keys(menuItems).map((e, i) => {
        return e !== "BATTERY" ? (
          <MyMenu item={menuItems[e]} itemKey={e} key={i} />
        ) : (
          <MyMenuItems item={menuItems[e]} itemKey={e} key={i} />
        );
      })}
    </Grid>
  );
};

export default HorizontalMenu;
