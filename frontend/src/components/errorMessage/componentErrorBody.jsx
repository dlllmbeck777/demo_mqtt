import React from "react";
import { Grid } from "@mui/material";
import "../../assets/styles/components/error/componentError.scss";
const ComponentErrorBody = ({ icon, text }) => (
  <Grid container alignItems="center" justify="center">
    <Grid item xs={12} className="component-error-body">
      {icon}
    </Grid>
    <Grid item xs={12} className="component-error-body">
      {text}
    </Grid>
  </Grid>
);

export default ComponentErrorBody;
