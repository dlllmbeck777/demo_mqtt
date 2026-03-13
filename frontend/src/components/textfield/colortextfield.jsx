import React from "react";
import { TextField } from "@mui/material";
const ColorTextfield = (props) => {
  const {
    handleChangeFunc = () => {},
    defaultValue = "",
    errFunc = () => {
      return false;
    },
    ...rest
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
      type="color"
      onChange={handleChange}
      sx={{
        "& .MuiOutlinedInput-input": {
          fontSize: "1rem",
          paddingTop: "4px",
          paddingBottom: "4px",
        },
        fontSize: "1rem",
        width: 75,
        minWidth: 75,
      }}
      {...rest}
    />
  );
};

export default ColorTextfield;
