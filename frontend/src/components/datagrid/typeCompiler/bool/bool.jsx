import React from "react";
import { Checkbox } from "@mui/material";
const bool = ({ handleChange, value }) => {
  return (
    <Checkbox
      onChange={(value) => {
        handleChange(value.target.checked ? "True" : "False");
      }}
      checked={value === "True" || value === true}
      value={value === "True" || value === true}
      sx={{
        display: "flex",
        alignItems: "center",
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    />
  );
};

export default bool;
