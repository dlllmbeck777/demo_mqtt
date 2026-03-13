import React from "react";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import "../../assets/styles/components/inputs/checkbox.scss";
const MyCheckbox = (props) => {
  const {
    handleChangeFunc = () => {},
    defaultValue = false,
    errFunc = () => {
      return false;
    },
    ...rest
  } = props;
  const [value, setValue] = React.useState(defaultValue);
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  const handleChange = () => {
    handleChangeFunc(!value);
    setValue(!value);
  };
  return (
    <Box className="chekcbox-container">
      <Checkbox
        size="small"
        checked={value}
        onChange={handleChange}
        error={errFunc()}
        className="chekcbox-container__input"
        {...rest}
      />
    </Box>
  );
};

export default MyCheckbox;
