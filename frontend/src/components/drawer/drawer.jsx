import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import App from "./app";
import { ComponentError, ComponentErrorBody } from "../index";
import { loadDrawerMenu } from "../../services/actions/drawerMenu/drawerMenu";
import { LoadingComponent } from "../../components";
const Drawer = () => {
  const dispatch = useDispatch();
  const navItems = useSelector((state) => state.drawerMenu?.data);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const culture = useSelector((state) => state.lang.cultur);
  const activeLayer = useSelector((state) => state.auth?.user?.active_layer);

  React.useEffect(() => {
    dispatch(loadDrawerMenu(culture));
  }, [activeLayer, isAuth, culture, dispatch]);
  return (
    <ComponentError
      errMsg={
        <ComponentErrorBody
          text="Something went wrong"
          icon={<ErrorOutlineIcon />}
        />
      }
    >
      <Box className={`drawer-menu`}>
        {navItems ? (
          Object.keys(navItems).length > 0 ? (
            <App menu={navItems} />
          ) : (
            <>Data No Found</>
          )
        ) : (
          <LoadingComponent></LoadingComponent>
        )}
      </Box>
    </ComponentError>
  );
};

export default React.memo(Drawer);
