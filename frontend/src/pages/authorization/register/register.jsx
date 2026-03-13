import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { add_error } from "../../../services/actions/error";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import history from "../../../routers/history";

import Layout from "../../../layout/authorization/layout";

import { setEmailPass } from "../../../services/reducers/registerFormReducer";
import { emailCheck } from "../../../services/actions/auth";
import UtilsServices from "../../../services/api/page/utils/utils";

const MyBody = ({ rest }) => {
  const dispatch = useDispatch();
  const isAgree = useSelector((state) => state.registerForm.isAgree);
  const validationSchema = yup.object({
    email: yup
      .string(rest?.["TYPE.PAGE.LOGIN.ERROR.EMAIL"]?.SHORT_LABEL)
      .email(rest?.["TYPE.PAGE.LOGIN.ERROR.EMAIL.VALID"]?.SHORT_LABEL)
      .required(rest?.["TYPE.PAGE.LOGIN.ERROR.EMAIL.REQUIRED"]?.SHORT_LABEL),
    password: yup
      .string(rest?.["TYPE.PAGE.LOGIN.ERROR.PASSWORD"]?.SHORT_LABEL)
      .required(rest?.["TYPE.PAGE.LOGIN.ERROR.PASSWORD.REQUIRED"]?.SHORT_LABEL)
      .min(8, rest?.["TYPE.PAGE.LOGIN.VALID.PASSWORD.MIN"]?.SHORT_LABEL)
      .matches(
        /^(?=.*[a-z])/,
        rest?.["TYPE.PAGE.LOGIN.VALID.PASSWORD.LOWER_CASE"]?.SHORT_LABEL
      )
      .matches(
        /^(?=.*[A-Z])/,
        rest?.["TYPE.PAGE.LOGIN.VALID.PASSWORD.UPPER_CASE"]?.SHORT_LABEL
      )
      .matches(
        /^(?=.*[0-9])/,
        rest?.["TYPE.PAGE.LOGIN.VALID.PASSWORD.NUMBER"]?.SHORT_LABEL
      )
      .matches(
        /^(?=.*[!@.;'^+%&/()=?>£#$½{[}])/,
        rest?.["TYPE.PAGE.LOGIN.VALID.PASSWORD.SPECIAL"]?.SHORT_LABEL
      ),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      isAgree: isAgree,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      dispatch(
        setEmailPass({
          email: values.email,
          password: values.password,
          isAgree: values.isAgree,
        })
      );
      let res = await dispatch(emailCheck(values.email));
      if (res[0]) {
        formik.touched.email = false;
        history.push(`/signup/signup`);
      } else {
        formik.touched.email = true;
        formik.errors.email = `${values.email} ${res[1]}`;
      }
    },
  });

  const [passVisible, setPassVisible] = useState(false);

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <TextField
          fullWidth
          name="email"
          label={rest?.["TYPE.PAGE.LOGIN.EMAIL"]?.SHORT_LABEL}
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
        />
        {formik.errors.email && formik.touched.email ? (
          <Box
            sx={{
              color: "#B3261E",
              position: "absolute",
              typography: "subtitle2",
              paddingBottom: "10px",
              zIndex: 2,
            }}
          >
            {formik.errors.email}
          </Box>
        ) : null}
        <TextField
          fullWidth
          id="password"
          name="password"
          placeholder={rest?.["TYPE.PAGE.LOGIN.PASSWORD"]?.SHORT_LABEL}
          label={rest?.["TYPE.PAGE.LOGIN.PASSWORD"]?.SHORT_LABEL}
          type={passVisible ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          sx={{ mt: 2 }}
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
        {formik.errors.password && formik.touched.password ? (
          <Box
            sx={{
              color: "#B3261E",
              position: "absolute",
              typography: "subtitle2",
              paddingBottom: "10px",
              width: "400px",
            }}
          >
            {formik.errors.password}
          </Box>
        ) : null}
        <Grid container sx={{ justifyContent: "center", my: 3 }}>
          <Grid item>
            <FormGroup>
              <FormControlLabel
                name="isAgree"
                control={
                  <Checkbox
                    checked={formik.values.isAgree}
                    sx={{
                      "&.Mui-checked": {
                        color: "text.secondary",
                      },
                    }}
                  />
                }
                onChange={formik.handleChange}
                label={
                  <Typography variant="body2">
                    {rest?.["TYPE.PAGE.LOGIN.AGREE"]?.SHORT_LABEL}
                  </Typography>
                }
                sx={{
                  color: "text.secondary",
                }}
              />
            </FormGroup>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          type="submit"
          sx={{
            width: "100%",
            textTransform: "capitalize",
            background: "linear-gradient(to bottom right, #3A416F, #141727)",
            color: "#ffffff",
            fontWeight: "700",
            borderRadius: "8px",
            p: 1.5,
          }}
        >
          {rest?.["TYPE.PAGE.LOGIN.SIGN_UP"]?.SHORT_LABEL}
        </Button>
      </form>
    </React.Fragment>
  );
};

const Register = () => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [props, setProps] = React.useState({});
  React.useEffect(() => {
    async function myFunc() {
      let res = await UtilsServices.pageText("LOGIN_SCREEN", {
        CULTURE,
        PARENT: ["LOGIN_SCREEN.SIGN_IN", "LOGIN_SCREEN.SIGN_UP"],
        ID: [],
      });
      setProps(res.data);
    }
    myFunc();
  }, []);
  return <Layout Element={MyBody} rest={props} isSignInPanel={false} />;
};

export default Register;
