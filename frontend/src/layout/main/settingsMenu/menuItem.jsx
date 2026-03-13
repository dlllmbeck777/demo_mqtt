import React from "react";
import { Grid } from "@mui/material";
const menuItem = ({ Icon, text }) => {
  return (
    <Grid container columnGap={1} sx={{ alignItems: "center" }}>
      <Icon />
      <Grid item>{text}</Grid>
    </Grid>
  );
};

export default menuItem;
