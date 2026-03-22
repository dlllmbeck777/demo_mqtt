import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, MenuItem, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneIcon from "@mui/icons-material/Done";

import MenuItems from "./menuItem";
import Auth from "../../../services/api/auth";
import history from "../../../routers/history";
import { loadUser } from "../../../services/actions/auth";
import { loadDrawerMenu } from "../../../services/actions/drawerMenu/drawerMenu";
const Layer = ({ changeMenu, handleClose, menuItem }) => {
  const dispatch = useDispatch();
  const [enableLayers, setEnableLayers] = React.useState([]);
  const userLayers = useSelector((state) => state.auth?.user?.layer_name || []);
  const activeLayer = useSelector((state) => state.auth?.user?.active_layer);
  const culture = useSelector((state) => state.lang.cultur);
  const layerSelect = async (LAYER_NAME) => {
    try {
      if (!LAYER_NAME || LAYER_NAME === activeLayer) {
        handleClose();
        return;
      }
      const body = JSON.stringify({ LAYER_NAME });
      try {
        await Auth.activeLayerUpdate(body);
        await dispatch(loadUser());
        await dispatch(loadDrawerMenu(culture));
      } catch (err) {
        console.log(err);
      }
      handleClose();
      history.push("/");
    } catch {}
  };
  React.useEffect(() => {
    async function myFunc() {
      if (userLayers?.length > 0) {
        setEnableLayers(
          [...userLayers].sort((left, right) => {
            if (left === right) {
              return 0;
            }
            if (left === "STD") {
              return -1;
            }
            if (right === "STD") {
              return 1;
            }
            return left.localeCompare(right);
          })
        );
        return;
      }
      let res = await Auth.userEnableLayer();
      setEnableLayers(
        [...(res.data || [])].sort((left, right) => {
          if (left === right) {
            return 0;
          }
          if (left === "STD") {
            return -1;
          }
          if (right === "STD") {
            return 1;
          }
          return left.localeCompare(right);
        })
      );
    }
    myFunc();
  }, [userLayers]);
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
      {enableLayers?.map((e) => {
        return (
          <MenuItem
            key={e}
            onClick={() => {
              layerSelect(e);
            }}
          >
            <Box className="settings-container__main-menu__item-icon-box">
              {activeLayer === e && <DoneIcon />}
            </Box>
            {e.charAt(0).toUpperCase() + e.slice(1)}
          </MenuItem>
        );
      })}
    </>
  );
};

export default Layer;
