import React from "react";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import "../../../assets/styles/components/inputs/checkbox.scss";
const MyCheckbox = (props) => {
  const { handleChange = () => {}, value = false, ...rest } = props;
  const handleChangeFunc = () => {
    handleChange(!value);
  };
  return (
    <Box className="chekcbox-container">
      <Checkbox
        size="small"
        checked={value}
        onChange={handleChangeFunc}
        className="chekcbox-container__input"
        {...rest}
      />
    </Box>
  );
};

export default React.memo(MyCheckbox);
