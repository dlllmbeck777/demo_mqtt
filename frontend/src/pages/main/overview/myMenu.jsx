import React from "react";
import { Grid, MenuItem, Menu, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import CircleIcon from "@mui/icons-material/Circle";

import { setSelectedCollapseMenu } from "../../../services/actions/collapseMenu/collapseMenu";
import history from "../../../routers/history";
import {
  updateLayouts,
  loadTapsOverview,
} from "../../../services/actions/overview/taps";
const MyMenu = ({ item, itemKey }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  async function handleClick(item) {
    dispatch(updateLayouts());
    dispatch(
      await setSelectedCollapseMenu({
        ...item,
      })
    );
    dispatch(await loadTapsOverview());
    history.push(`/${item.path}`);
  }
  return (
    <>
      <Grid
        item
        onClick={handleMenu}
        className="overview-container__horizontal-menu__body__item__text"
      >
        <Button>{itemKey}</Button>
      </Grid>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(item).map((e, i) => {
          return (
            <MenuItem
              key={i}
              onClick={() => {
                handleClick(item[e]);
                handleClose();
              }}
              sx={{ alignItems: "center" }}
            >
              {item[e].ACTIVE &&
                (item[e].ACTIVE === "True" ? (
                  <CircleIcon sx={{ color: "green", mr: 0.5 }} />
                ) : (
                  <CircleIcon sx={{ color: "red", mr: 0.5 }} />
                ))}
              {e}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default React.memo(MyMenu);
