import React from "react";
import $ from "jquery";

import { Box } from "@mui/material";

import ProfileService from "../../services/api/profile";
import { Drawer } from "../../components";
import Header from "./header";

const Main = ({ Element }) => {
  React.useEffect(() => {
    async function myFunc() {
      try {
        let res = await ProfileService.loadProfileSettings();
        if (res.data?.[0]?.full_screen)
          $(".normal-screen-box").addClass("full-screen-box");
        else $(".normal-screen-box").removeClass("full-screen-box");
      } catch {}
    }
    myFunc();
  }, []);
  return (
    <Box className="main-layout">
      <Box className="normal-screen-box">
        <Box className="header-box">
          <Box className="header-box__header">
            <Header />
          </Box>
        </Box>
        <Box className="app-body">
          <Box className="app-body__drawer-container">
            <Drawer />
          </Box>
          <Box className="app-body__element-container">{Element}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(Main);
