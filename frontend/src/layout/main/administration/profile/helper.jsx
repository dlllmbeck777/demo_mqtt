import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, TextField, InputLabel } from "@mui/material";
import { handleChange } from "../../../../services/actions/profile/profile";
import "../../../../assets/styles/page/administration/profile/personalInfo.scss";
const Helper = ({ value, ...rest }) => {
  const dispatch = useDispatch();
  const err = useSelector((state) => state.profile.errors?.[value]);
  const val = useSelector((state) => state.profile.values?.[value]);
  let placeholder = value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return (
    <Box sx={{ position: "relative" }}>
      <InputLabel
        htmlFor={value}
        className="profile-personal-info__body__form-label"
      >
        {placeholder}
      </InputLabel>
      <TextField
        fullWidth
        id={value}
        name={value}
        placeholder={placeholder}
        type={"text"}
        onChange={(event) => {
          dispatch(handleChange(value, event.target.value));
        }}
        value={val}
        error={err}
        {...rest}
      />
      <Box
        sx={{
          color: "#B3261E",
          position: "absolute",
          paddingBottom: "10px",
        }}
      >
        {err}
      </Box>
    </Box>
  );
};

export default Helper;
