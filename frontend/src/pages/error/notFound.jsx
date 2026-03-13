import React from "react";
import { Grid, Typography, Link } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import history from "../../routers/history";
import "../../assets/styles/page/errorPage.scss";
const notFound = () => {
  return (
    <Grid container className="error-pop-up">
      <Grid item xs={4} className="error-pop-up__body">
        <Grid container>
          <Grid item xs={12} className="error-pop-up__body__icon">
            <ErrorOutlineIcon fontSize="large" />
          </Grid>
          <Grid item xs={12} className="error-pop-up__body__text">
            <Typography variant="h4">404!</Typography>
          </Grid>
          <Grid item xs={12} className="error-pop-up__body__text">
            <Typography variant="h5">Page not found</Typography>
          </Grid>
          <Grid item xs={12} className="error-pop-up__body__text">
            <Typography variant="h6">
              (Would you like to return{" "}
              <Link
                //underline="none"
                onClick={() => {
                  history.push("/home");
                }}
              >
                home
              </Link>
              ?)
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default notFound;
