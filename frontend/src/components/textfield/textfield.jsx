import React from "react";
import { TextField } from "@mui/material";
const MyTextfield = (props) => {
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
      {...rest}
      variant="outlined"
      value={value}
      onChange={handleChange}
      sx={{
        "& .MuiOutlinedInput-input": {
          paddingTop: "4px",
          paddingBottom: "4px",
          fontSize: "1rem",
        },
        fontSize: "1rem",
        width: "100%",
        minWidth: 125,
      }}
    />
  );
};

export default MyTextfield;
