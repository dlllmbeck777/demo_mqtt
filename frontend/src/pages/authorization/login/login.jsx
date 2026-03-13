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
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import history from "../../../routers/history";

import Layout from "../../../layout/authorization/layout";

import { login } from "../../../services/actions/auth";
import { setLoaderTrue } from "../../../services/actions/loader";
import UtilsServices from "../../../services/api/page/utils/utils";

const navigate = (e, route) => {
  e.preventDefault();
  history.push(`${route}`);
};
const MyBody = ({ rest }) => {
  console.log(rest);
  const dispatch = useDispatch();

  const validationSchema = yup.object({
    email: yup
      .string(rest?.["TYPE.PAGE.LOGIN.ERROR.EMAIL"]?.SHORT_LABEL)
      .email(rest?.["TYPE.PAGE.LOGIN.ERROR.EMAIL.VALID"]?.SHORT_LABEL)
      .required(rest?.["TYPE.PAGE.LOGIN.ERROR.EMAIL.REQUIRED"]?.SHORT_LABEL),
    password: yup
      .string(rest?.["TYPE.PAGE.LOGIN.ERROR.PASSWORD"]?.SHORT_LABEL)
      .required(rest?.["TYPE.PAGE.LOGIN.ERROR.PASSWORD.REQUIRED"]?.SHORT_LABEL),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(setLoaderTrue());
      dispatch(login(values.email, values.password));
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

        <Grid
          container
          sx={{ justifyContent: "space-between", alignItems: "center", my: 3 }}
        >
          <Grid item>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    sx={{
                      "&.Mui-checked": {
                        color: "text.secondary",
                      },
                    }}
                  />
                }
                label={rest?.["TYPE.PAGE.LOGIN.REMEMBER_ME"]?.SHORT_LABEL}
                sx={{
                  color: "text.secondary",
                }}
              />
            </FormGroup>
          </Grid>
          <Grid item>
            <Link
              underline="none"
              onClick={(e) => {
                navigate(e, "/signin/forgotpassword");
              }}
              sx={{ fontWeight: "700", cursor: "pointer", fontSize: "14px" }}
            >
              {rest?.["TYPE.PAGE.LOGIN.FORGOT_PASSWORD"]?.SHORT_LABEL}
            </Link>
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
          {rest?.["TYPE.PAGE.LOGIN.SIGN_IN"]?.SHORT_LABEL}
        </Button>
      </form>
    </React.Fragment>
  );
};

const Login = () => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [props, setProps] = React.useState({});
  React.useEffect(() => {
    async function myFunc() {
      let res = await UtilsServices.pageText("LOGIN_SCREEN", {
        CULTURE,
        PARENT: ["LOGIN_SCREEN.SIGN_IN"],
        ID: [],
      });
      setProps(res.data);
    }
    myFunc();
  }, []);

  return <Layout Element={MyBody} rest={props} isSignInPanel={true} />;
};

export default Login;
