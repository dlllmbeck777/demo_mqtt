import React from "react";
import { Chip } from "@mui/material";
const main = ({ value }) => {
  return (
    <Chip
      label={value}
      variant="outlined"
      size="small"
      sx={{
        color: value === "Running" ? "green" : "red" + " !important",
        borderColor: value === "Running" ? "green" : "red" + " !important",
      }}
    />
  );
};

export default main;
