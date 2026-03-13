import React from "react";
import { TextField } from "@mui/material";
import "../../../assets/styles/components/inputs/numberTextField.scss";
const MyNumberTextField = (props) => {
  const { handleChange = () => {}, value = "", ...rest } = props;
  const handleChangeFunc = (e) => {
    handleChange(e.target.value);
  };
  return (
    <TextField
      variant="outlined"
      type="number"
      onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
      value={value}
      onChange={handleChangeFunc}
      className="number-text-field"
      {...rest}
    />
  );
};

export default React.memo(MyNumberTextField);
