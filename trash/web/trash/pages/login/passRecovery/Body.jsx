import React from "react";

import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import history from "../../../routers/history";
import styles from "../../../assets/Styles/pages/login/passRecovery/body";

const navigate = (e, route) => {
  e.preventDefault();
  history.push(`${route}`);
};

const body = () => {
  return (
    <Box sx={styles().box}>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5">Password recovery</Typography>
          <Typography variant="body2" sx={styles().text}>
            How would you like to receive a password reset code?
          </Typography>
          <FormControl sx={{ display: "block" }}>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
            >
              <FormControlLabel
                value="mail"
                control={<Radio />}
                label={
                  <div>
                    <Typography variant="body2" sx={{ fontWeight: "300" }}>
                      Send code to email address
                    </Typography>
                  </div>
                }
              />
              <Typography variant="body2" sx={styles().email}>
                ***@******
              </Typography>
              <FormControlLabel
                value="number"
                control={<Radio />}
                label={
                  <div>
                    <Typography variant="body2" sx={{ fontWeight: "300" }}>
                      Send code by SMS
                    </Typography>
                  </div>
                }
              />
              <Typography variant="body2" sx={styles().phone}>
                +77787787777
              </Typography>
            </RadioGroup>
          </FormControl>
          <Button
            variant="contained"
            sx={styles().btnNextPhone}
            onClick={(e) => {
              navigate(e, "/login/securecode");
            }}
          >
            Next
          </Button>
          <Box sx={styles().boxNoMoreAccess}>
            <Link
              variant="caption"
              xs={{
                display: "block",
                textDecoration: "none",
              }}
            >
              No more access?
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} sx={styles().body}>
          <Box sx={styles().bodyBox}>
            <Avatar src="/broken-image.jpg" sx={{ display: "inline-block" }} />
            <Typography variant="body2" sx={{ fontWeight: "300" }}>
              +77787787777
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "300" }}>
              System adminstrator
            </Typography>
          </Box>
        </Grid>
        <Button
          variant="contained"
          sx={styles().btnNextPc}
          onClick={(e) => {
            navigate(e, "/login/securecode");
          }}
        >
          Next
        </Button>
      </Grid>
    </Box>
  );
};

export default body;
