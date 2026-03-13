import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Divider, Slider } from "@mui/material";
import { Select } from "../../../../components";
import { handleChangeSettings } from "../../../../services/actions/profile/profile";
const Appearance = () => {
  const dispatch = useDispatch();
  const fontSize = useSelector((state) =>
    state.profile.values?.font_size === undefined
      ? 8
      : parseInt(state.profile.values?.font_size)
  );
  const fontWeight = useSelector((state) =>
    state.profile.values?.font_weight === undefined
      ? 100
      : parseInt(state.profile.values?.font_weight)
  );
  const oriantation = useSelector((state) =>
    state.profile.values?.overview_orientation === undefined
      ? "Horizontal"
      : state.profile.values?.overview_orientation
  );
  const fontSizeSelect = (e) => {
    dispatch(handleChangeSettings("font_size", e.target.value));
  };
  const fontWeightSelect = (e) => {
    dispatch(handleChangeSettings("font_weight", e.target.value));
  };
  const marks = [
    {
      value: 8,
      label: "aA",
    },
    {
      value: 13,
      label: "aA",
    },
    {
      value: 18,
      label: "aA",
    },
  ];
  const fontweight = [
    {
      value: 100,
      label: "aA",
    },
    {
      value: 500,
      label: "aA",
    },
    {
      value: 900,
      label: "aA",
    },
  ];
  return (
    <Box>
      <Box className="profile-settings__body__appearance__header">
        Font Size
      </Box>
      <Box className="profile-settings__body__appearance__text">
        Change the font size of text
      </Box>
      <Box
        className="profile-settings__body__appearance__font-size-select"
        sx={{
          "&:hover": { backgroundColor: "transparent" },
          '& [data-index="0"]': {
            fontSize: "8px",
          },
          '& [data-index="1"]': {
            fontSize: "13px",
          },
          '& [data-index="2"]': {
            fontSize: "18px",
          },
          my: 1,
        }}
      >
        <Slider
          value={fontSize}
          onChange={fontSizeSelect}
          step={1}
          min={8}
          max={18}
          valueLabelDisplay="auto"
          marks={marks}
          sx={{ width: "50%" }}
        />
      </Box>
      <Box sx={{ fontSize: fontSize }}>Sample Text</Box>
      <Divider sx={{ my: 2 }} />
      <Box className="profile-settings__body__appearance__header">
        Font Weight
      </Box>
      <Box className="profile-settings__body__appearance__text">
        Change the font size of text
      </Box>
      <Box
        className="profile-settings__body__appearance__font-size-select"
        sx={{
          "&:hover": { backgroundColor: "transparent" },
          '& [data-index="0"]': {
            fontWeight: "100",
          },
          '& [data-index="1"]': {
            fontWeight: "500",
          },
          '& [data-index="2"]': {
            fontWeight: "900",
          },
          my: 1,
        }}
      >
        <Slider
          value={fontWeight}
          onChange={fontWeightSelect}
          step={100}
          min={100}
          max={900}
          valueLabelDisplay="auto"
          marks={fontweight}
          sx={{ width: "50%" }}
        />
      </Box>
      <Box sx={{ fontWeight: fontWeight }}>Sample Text</Box>

      <Divider sx={{ my: 2 }} />
      <Box className="profile-settings__body__appearance__header">
        Overview Oriantation
      </Box>
      <Box className="profile-settings__body__appearance__text">
        Change the oriantation of overview
      </Box>
      <Box>
        <Select
          values={["horizontal", "vertical"]}
          defaultValue={oriantation}
          handleChangeFunc={(value) => {
            dispatch(handleChangeSettings("overview_orientation", value));
          }}
          sx={{
            width: "50%",
            mt: 2,
            textTransform: "capitalize",
          }}
        />
      </Box>
    </Box>
  );
};

export default Appearance;
