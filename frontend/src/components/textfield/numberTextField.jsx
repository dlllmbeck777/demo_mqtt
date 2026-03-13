import React from "react";
import { TextField } from "@mui/material";
import "../../assets/styles/components/inputs/numberTextField.scss";
const MyNumberTextField = (props) => {
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
      type="number"
      onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
      value={value}
      onChange={handleChange}
      className="number-text-field"
      {...rest}
    />
  );
};

export default MyNumberTextField;
