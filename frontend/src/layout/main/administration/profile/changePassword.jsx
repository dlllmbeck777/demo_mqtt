import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Grid,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";

import ComponentHeader from "./componentHeader";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useFormik } from "formik";
import * as yup from "yup";
import "../../../../assets/styles/page/administration/profile/changePassword.scss";

import { changePassword } from "../../../../services/actions/profile/profile";
const validationSchema = yup.object({
  old_password: yup.string().required("Old password is required"),
  new_password: yup
    .string("Enter your password")
    .required("Password is required")
    .min(8, "Must Contain 8 Characters")
    .matches(/^(?=.*[a-z])/, `Must contain one lowercase letter`)
    .matches(/^(?=.*[A-Z])/, `Must contain one upercase letter`)
    .matches(/^(?=.*[0-9])/, `Must contain one number`)
    .matches(
      /^(?=.*[!@.;'^+%&/()=?>£#$½{[}])/,
      `Must contain one special case character`
    ),
  new_password_confirmation: yup
    .string()
    .oneOf([yup.ref("new_password"), null], "Passwords must match")
    .required("Confirm new password is required"),
});

const Pass = ({ formik, value }) => {
  const [passVisible, setPassVisible] = useState(false);
  let placeholder = value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return (
    <Box sx={{ position: "relative", marginTop: "15px" }}>
      <label
        htmlFor={value}
        className="profile-change-password__body__change-pass__label"
      >
        {placeholder}
      </label>
      <TextField
        fullWidth
        id={value}
        name={value}
        placeholder={placeholder}
        type={passVisible ? "text" : "password"}
        onChange={formik.handleChange}
        error={formik.touched[value] && Boolean(formik.errors[value])}
        className="profile-change-password__body__change-pass__textfield"
        InputProps={{
          endAdornment: (
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
          ),
        }}
      />
      {formik.errors[value] && formik.touched[value] ? (
        <Box
          sx={{
            color: "#B3261E",
            position: "absolute",
            paddingBottom: "10px",
            width: "400px",
            bottom: "-14px",
          }}
        >
          {formik.errors[value]}
        </Box>
      ) : null}
    </Box>
  );
};

const ChangePassword = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(changePassword(values));
    },
  });
  const info = [
    "- At least 8 characters",
    "- At least 1 lower letter (a-z)",
    "- At least 1 uppercase letter (A-Z)",
    "- At least 1 number (0-9)",
    "- At least 1 special characters",
  ];
  return (
    <Box className="profile-change-password">
      <ComponentHeader header="Change Password" />
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Grid container className="profile-change-password__body">
          <Grid
            item
            xs={6}
            className="profile-change-password__body__change-pass"
          >
            {Object.keys(formik.initialValues).map((e, i) => {
              return <Pass value={e} key={i} formik={formik} />;
            })}
          </Grid>
          <Grid item xs={6} className="profile-change-password__body__info">
            <Box className="profile-change-password__body__info__header">
              New password must contain:
            </Box>
            {info.map((e, i) => {
              return (
                <>
                  <Box className="profile-change-password__body__info__text">
                    {e}
                  </Box>
                  {!(i + 1 === info.length) && <Divider />}
                </>
              );
            })}
          </Grid>
        </Grid>

        <Box className="profile-change-password__btn-save">
          <Button type="submit" variant="outlined">
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ChangePassword;
