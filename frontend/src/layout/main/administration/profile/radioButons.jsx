import React from "react";
import { FormControlLabel, Radio, Box } from "@mui/material";
import "../../../../assets/styles/page/administration/profile/profile.scss";
const radioButons = ({ value, handleClick }) => {
  return (
    <Box
      className="radio-button-custom"
      onClick={() => {
        handleClick(value);
      }}
    >
      <Box
        className={`radio-button-custom__img-box radio-button-custom__img-box__${value}`}
      />
      <FormControlLabel
        value={value}
        control={<Radio />}
        label={value}
        className="radio-button-custom__form-control"
      ></FormControlLabel>
    </Box>
  );
};

export default radioButons;
