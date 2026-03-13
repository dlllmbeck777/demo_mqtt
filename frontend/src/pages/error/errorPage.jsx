import React from "react";
import { Grid, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import "../../assets/styles/page/errorPage.scss";
const errorPage = () => {
  return (
    <Grid container className="error-pop-up">
      <Grid item xs={4} className="error-pop-up__body">
        <Grid container>
          <Grid item xs={12} className="error-pop-up__body__icon">
            <ErrorOutlineIcon fontSize="large" />
          </Grid>
          <Grid item xs={12} className="error-pop-up__body__text">
            <Typography variant="h4">BOOM!</Typography>
          </Grid>
          <Grid item xs={12} className="error-pop-up__body__text">
            <Typography variant="h5">
              something has gone terribly wrong
            </Typography>
          </Grid>
          <Grid item xs={12} className="error-pop-up__body__text">
            <Typography variant="h6">
              (but we already sent droids to fix it)
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default errorPage;
