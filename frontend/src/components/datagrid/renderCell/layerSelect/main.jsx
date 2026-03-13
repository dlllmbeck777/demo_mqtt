import React from "react";
import { Chip } from "@mui/material";
const main = ({ value }) => {
  return value?.map((e, i) => {
    return (
      <Chip
        key={i}
        label={e}
        variant="outlined"
        color="secondary"
        sx={{ fontSize: "1rem", fontWeight: "400", ml: 0.5 }}
      />
    );
  });
};

export default main;
