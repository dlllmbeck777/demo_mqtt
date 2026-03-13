import React from "react";
import { TextField } from "@mui/material";
const MyTextfield = (props) => {
  const { handleChange = () => {}, value = "" } = props;
  const handleChangeFunc = (e) => {
    handleChange(e.target.value);
  };

  return (
    <TextField
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
        width: "100%",
        justifyContent: "center",
      }}
    />
  );
};

export default MyTextfield;
