import React, { useState } from "react";
import { TextField } from "@mui/material";
const MyTextfield = (props) => {
  const { handleChange = () => {}, value = "" } = props;
  const handleChangeFunc = (e) => {
    handleChange(parseFloat(e.target.value));
  };

  return (
    <TextField
      type="number"
      value={value}
      onChange={handleChangeFunc}
      sx={{
        "& .MuiOutlinedInput-input": {
          fontSize: "1rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: "none !important",
        },
        fontSize: "1rem",
        height: "100%",
        justifyContent: "center",
      }}
    />
  );
};

export default React.memo(MyTextfield);
