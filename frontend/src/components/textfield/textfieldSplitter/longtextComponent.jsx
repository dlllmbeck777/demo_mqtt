import React from "react";
import { TextField } from "@mui/material";
const MyMultilineTextField = (props) => {
  const { handleChange = () => {}, value = "", ...rest } = props;
  const handleChangeFunc = (e) => {
    handleChange(e.target.value);
  };

  return (
    <TextField
      variant="outlined"
      value={value}
      onChange={handleChangeFunc}
      multiline
      maxRows={4}
      sx={{
        fontSize: "1rem",
        "& .MuiInputBase-root": {
          fontSize: "1rem",
          paddingTop: "4px",
          paddingBottom: "4px",
        },
        width: "100%",
      }}
      {...rest}
    />
  );
};

export default React.memo(MyMultilineTextField);
