import React from "react";
import { Box } from "@mui/material";

import Header from "./header";
import Footer from "./footer";

const Start = ({ children }) => {
  return (
    <Box className="starter-container">
      <Header />
      <Box className="starter-container__body">{children}</Box>
      <Footer />
    </Box>
  );
};

export default Start;
