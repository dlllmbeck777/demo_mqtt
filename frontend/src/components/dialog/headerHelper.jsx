import React from "react";
import { Box } from "@mui/material";
const headerHelper = ({ text }) => {
  return (
    <Box
      id="draggable-dialog-title"
      className="dialog-container__paper__header"
    >
      <Box>{text}</Box>
    </Box>
  );
};

export default headerHelper;
