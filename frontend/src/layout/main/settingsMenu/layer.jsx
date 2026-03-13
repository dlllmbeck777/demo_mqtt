import React from "react";
import { useSelector } from "react-redux";

import { Box, MenuItem, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneIcon from "@mui/icons-material/Done";

import MenuItems from "./menuItem";
import Auth from "../../../services/api/auth";
const Layer = ({ changeMenu, handleClose, menuItem }) => {
  const [enableLayers, setEnableLayers] = React.useState([]);
  // const enableLayers = useSelector((state) => state.auth?.user?.layer_name);
  const activeLayer = useSelector((state) => state.auth?.user?.active_layer);
  const layerSelect = async (LAYER_NAME) => {
    try {
      const body = JSON.stringify({ LAYER_NAME });
      try {
        await Auth.activeLayerUpdate(body);
      } catch (err) {
        console.log(err);
      }
      window.location.reload();
    } catch {}
  };
  React.useEffect(() => {
    async function myFunc() {
      let res = await Auth.userEnableLayer();
      setEnableLayers(res.data);
    }
    myFunc();
  }, []);
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
