import React from "react";
import { TextField } from "@mui/material";
const MyTextfield = (props) => {
  const { handleChange = () => {}, value = "", ...rest } = props;
  const handleChangeFunc = (e) => {
    handleChange(e.target.value);
  };
  return (
    <TextField
      variant="outlined"
      value={value}
      onChange={handleChangeFunc}
      sx={{
        "& .MuiOutlinedInput-input": {
          paddingTop: "4px",
          paddingBottom: "4px",
          fontSize: "1rem",
        },
        fontSize: "1rem",
        width: "100%",
      }}
      {...rest}
    />
  );
};

export default React.memo(MyTextfield);
