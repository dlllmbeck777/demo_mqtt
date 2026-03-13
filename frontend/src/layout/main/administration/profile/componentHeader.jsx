import React from "react";
import { Box } from "@mui/material";
import { ItemSperatorLineXL } from "../../../../components";
const ComponentHeader = ({ header }) => {
  return (
    <>
      <Box className="profile-container__body__header">{header}</Box>
      <ItemSperatorLineXL />
    </>
  );
};

export default ComponentHeader;
