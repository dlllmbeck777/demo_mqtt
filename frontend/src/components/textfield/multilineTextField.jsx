import React from "react";
import { TextField } from "@mui/material";
const MyMultilineTextField = (props) => {
  const {
    handleChangeFunc = () => {},
    defaultValue = "",
    errFunc = () => {
      return false;
    },
  } = props;
  const [value, setValue] = React.useState(defaultValue);
  const handleChange = (e) => {
    setValue(e.target.value);
    handleChangeFunc(e.target.value);
  };
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  return (
    <TextField
      error={errFunc()}
      variant="outlined"
      value={value}
      onChange={handleChange}
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
    />
  );
};

export default MyMultilineTextField;
