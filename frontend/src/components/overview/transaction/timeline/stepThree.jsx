import React from "react";
import { Grid } from "@mui/material";
import Stop from "../../../highchart/popUpLayout/stop";
import { Stops } from "../../../highchart/popUpLayout/stops";

const stepThree = () => {
  return (
    <>
      <Grid
        container
        sx={{
          mb: 2,
        }}
      >
        <Stop />
      </Grid>
      <Stops />
    </>
  );
};

export default stepThree;
