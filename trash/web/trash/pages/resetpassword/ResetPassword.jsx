import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
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

import history from "../../routers/history";

import { reset_password } from "../../services/actions/auth";
import styles from "../../assets/Styles/pages/resetpassword/resetpassword";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      (await dispatch(reset_password(values.email, values.password))) ? (
        <></>
      ) : (
        history.push(`/`)
      );
    },
  });
  const [passVisible, setPassVisible] = useState(true);

  return (
    <Box sx={styles().box}>
      <form onSubmit={formik.handleSubmit}>
        <Typography sx={styles().header}>Enter a new password</Typography>
        <Typography>
          Create a new password that is at least 6 characters long. A strong
          password is a combination of letters, numbers, and punctuation.
        </Typography>
        <OutlinedInput
          name="email"
          placeholder={"Enter eposta"}
          value={formik.values.email}
          sx={styles().input}
          onChange={formik.handleChange}
        />
        <OutlinedInput
          name="password"
          placeholder={"Enter new password"}
          type={passVisible ? "text" : "password"}
          value={formik.values.password}
          sx={styles().input}
          onChange={formik.handleChange}
          endAdornment={
            <InputAdornment
              position="end"
              sx={styles().cursorPointer}
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

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button variant="contained" sx={styles().button} type="submit">
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default ResetPassword;
