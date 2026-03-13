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

import { change_password } from "../../services/actions/auth";
import styles from "../../assets/Styles/pages/changepass/changepass";

const ChangePass = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      newpassword: "",
      repassword: "",
      oldpassword: "",
    },
    onSubmit: async (values) => {
      (await dispatch(
        change_password(
          values.newpassword,
          values.repassword,
          values.oldpassword
        )
      )) ? (
        <></>
      ) : (
        history.push("/")
      );
    },
  });

  const [passVisible, setPassVisible] = useState([false, false, false]);
  return (
    <Box sx={styles().box}>
      <Typography sx={styles().header}>Enter a new password</Typography>
      <Typography>
        Create a new password that is at least 6 characters long. A strong
        password is a combination of letters, numbers, and punctuation.
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <OutlinedInput
          name="oldpassword"
          placeholder={"Enter old password"}
          type={passVisible[0] ? "text" : "password"}
          value={formik.values.oldpassword}
          sx={styles().input}
          onChange={formik.handleChange}
          endAdornment={
            <InputAdornment
              position="end"
              sx={styles().cursorPointer}
              onClick={() => {
                passVisible[0] = !passVisible[0];
                setPassVisible([...passVisible]);
              }}
            >
              {passVisible[0] ? (
                <VisibilityOffOutlinedIcon />
              ) : (
                <VisibilityOutlinedIcon />
              )}
            </InputAdornment>
          }
        />
        <OutlinedInput
          name="newpassword"
          placeholder={"Enter new password"}
          type={passVisible[1] ? "text" : "password"}
          value={formik.values.newpassword}
          sx={styles().input}
          onChange={formik.handleChange}
          endAdornment={
            <InputAdornment
              position="end"
              sx={styles().cursorPointer}
              onClick={() => {
                passVisible[1] = !passVisible[1];
                setPassVisible([...passVisible]);
              }}
            >
              {passVisible[1] ? (
                <VisibilityOffOutlinedIcon />
              ) : (
                <VisibilityOutlinedIcon />
              )}
            </InputAdornment>
          }
        />
        <OutlinedInput
          name="repassword"
          placeholder={"Enter repassword"}
          type={passVisible[2] ? "text" : "password"}
          value={formik.values.repassword}
          sx={styles().input}
          onChange={formik.handleChange}
          endAdornment={
            <InputAdornment
              position="end"
              sx={styles().cursorPointer}
              onClick={() => {
                passVisible[2] = !passVisible[2];
                setPassVisible([...passVisible]);
              }}
            >
              {passVisible[2] ? (
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

export default ChangePass;
