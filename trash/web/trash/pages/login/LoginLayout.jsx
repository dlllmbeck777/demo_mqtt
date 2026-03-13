import React from "react";
import { Outlet } from "react-router-dom";

import { Box } from "@mui/material";

import Header from "./Header";
import Fouter from "./Footer";

const LoginLayout = () => {
  return (
    <>
      <Box sx={{ backgroundColor: "#F0F2F5", height: "100vh" }}>
        <Header />
        <Outlet />
        <Fouter />
      </Box>
    </>
  );
};

export default LoginLayout;
