import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, RadioGroup, Grid } from "@mui/material";
import RadioButons from "./radioButons";
import { Select } from "../../../../components";
import { handleChangeSettings } from "../../../../services/actions/profile/profile";
const Theme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) =>
    state.profile.values?.thema === undefined
      ? "light"
      : state.profile.values?.thema
  );
  return (
    <>
      <Box className="profile-settings__body__appearance__header">Theme</Box>
      <Box className="profile-settings__body__appearance__text">
        Change the theme
      </Box>
      <Select
        values={["light", "dark", "temp", "tempDark", "temp2", "tempDark2"]}
        defaultValue={theme}
        handleChangeFunc={(value) => {
          dispatch(handleChangeSettings("thema", value));
        }}
        sx={{
          width: "50%",
          mt: 2,
          textTransform: "capitalize",
        }}
      />
    </>
  );
};

export default Theme;
