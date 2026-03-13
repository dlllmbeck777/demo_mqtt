import React from "react";
import { Grid } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
const menuItem = ({ Icon, text }) => {
  return (
    <Grid
      container
      sx={{ alignItems: "center", justifyContent: "space-between" }}
    >
      <Grid item>
        <Grid
          container
          columnGap={1}
          sx={{ alignItems: "center", display: "flex" }}
        >
          <Icon /> {text}
        </Grid>
      </Grid>
      <KeyboardArrowRightIcon sx={{ float: "right" }} />
    </Grid>
  );
};

export default menuItem;
