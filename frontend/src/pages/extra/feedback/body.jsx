import React from "react";
import { useDispatch } from "react-redux";

import { Box, Grid, Button } from "@mui/material";
import Helper from "./helper";

import { handleSubmit } from "../../../services/actions/feedback/feedback";
const Body = () => {
  const dispatch = useDispatch();
  return (
    <Box>
      <Box className="feedback-page__header">Send Feedback</Box>
      <Box className="feedback-page__text">
        We highly value your opinions and ideas about us.
      </Box>
      <Box className="feedback-page__text">
        Can you give us feedback so that we can improve ourselves?
      </Box>
      <Box className="feedback-page__input-box">
        <Grid container columnSpacing={3} rowGap={3}>
          <Grid item xs={6}>
            <Helper value="name" />
          </Grid>
          <Grid item xs={6}>
            <Helper value="company_name" />
          </Grid>
          <Grid item xs={6}>
            <Helper value="email" />
          </Grid>
          <Grid item xs={6}>
            <Helper value="phone_number" />
          </Grid>
          <Grid item xs={12}>
            <Helper value="message" multiline={true} minRows={4} />
          </Grid>
        </Grid>
        <Box className="feedback-page__input-box__btn-save">
          <Button
            type="submit"
            variant="outlined"
            onClick={() => {
              dispatch(handleSubmit());
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Body;
