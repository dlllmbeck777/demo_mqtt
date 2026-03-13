import React, { useState } from "react";

import {
  Box,
  Button,
  Grid,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import history from "../../../routers/history";
import styles from "../../../assets/Styles/pages/login/newPassword/body";

const navigate = (e, route) => {
  e.preventDefault();
  history.push(`${route}`);
};

const Body = () => {
  const [passVisible, setPassVisible] = useState(false);
  const [password, setPassword] = useState([
    {
      password: "",
    },
  ]);
  return (
    <Box sx={styles().box}>
      <Typography sx={styles().header}>Enter a new password</Typography>
      <Typography>
        Create a new password that is at least 6 characters long. A strong
        password is a combination of letters, numbers, and punctuation.
      </Typography>
      <OutlinedInput
        placeholder={"Enter password"}
        type={passVisible ? "text" : "password"}
        value={password[0].password}
        sx={styles().input}
        onChange={(e) => {
          password[0].password = e.target.value;
          setPassword([...password]);
        }}
        endAdornment={
          <InputAdornment
            position="end"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setPassVisible(!passVisible);
            }}
          >
            {passVisible ? (
              <VisibilityOffOutlinedIcon />
            ) : (
              <VisibilityOutlinedIcon />
            )}
          </InputAdornment>
        }
      />
      <Grid
        container
        spacing={2}
        flexDirection="row-reverse"
        sx={styles().btnContainer}
      >
        <Grid item>
          <Button
            variant="contained"
            sx={styles().btnNext}
            onClick={(e) => {
              navigate(e, "/");
            }}
          >
            Next
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="inherit"
            sx={styles().btnCancel}
            onClick={(e) => {
              navigate(e, "/");
            }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Body;
