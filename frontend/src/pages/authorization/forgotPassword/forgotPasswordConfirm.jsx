import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Button, Grid, InputAdornment, TextField } from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import { forgot_password_confirm } from "../../../services/actions/auth";
import history from "../../../routers/history";
import UtilsServices from "../../../services/api/page/utils/utils";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const [passVisible, setPassVisible] = React.useState(false);
  const [passConfirmVisible, setPassConfirmVisible] = React.useState(false);
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [props, setProps] = React.useState({});
  React.useEffect(() => {
    async function myFunc() {
      let res = await UtilsServices.pageText("LOGIN_SCREEN", {
        CULTURE,
        PARENT: ["LOGIN_SCREEN.FORGET_PASS.CONFIRM"],
        ID: [
          "TYPE.PAGE.LOGIN.PASSWORD",
          "TYPE.PAGE.LOGIN.ERROR.PASSWORD.REQUIRED",
        ],
      });

      setProps(res.data);
    }
    myFunc();
  }, []);
  const validationSchema = yup.object({
    password: yup
      .string()
      .required(
        props?.["TYPE.PAGE.LOGIN.ERROR.PASSWORD.REQUIRED"]?.SHORT_LABEL
      ),
    confirmpassword: yup.string().when("password", {
      is: (val) => (val && val.length > 0 ? true : false),
      then: yup
        .string()
        .oneOf(
          [yup.ref("password")],
          props?.["TYPE.PAGE.LOGIN.FORGET_PASS.VALID_MESSAGE"]?.SHORT_LABEL
        ),
    }),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmpassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(forgot_password_confirm(token, values.password));
      history.push("/signin");
    },
  });

  return (
    <Grid
      container
      sx={{
        justifyContent: "center",
        alignItems: "center",
        minHeight: "349px",
      }}
    >
      <Grid
        item
        sx={{
          backgroundColor: "myBackgroundColor",
          p: 3,
          pb: 6.5,
          boxShadow: "0px 20px 27px rgba(0, 0, 0, 0.05)",
          borderRadius: "12px",
          width: "410px",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="password"
            name="password"
            placeholder={props?.["TYPE.PAGE.LOGIN.PASSWORD"]?.SHORT_LABEL}
            label={props?.["TYPE.PAGE.LOGIN.PASSWORD"]?.SHORT_LABEL}
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
              }}
            >
              {formik.errors.password}
            </Box>
          ) : null}
          {/*--------------------------------*/}
          <TextField
            fullWidth
            id="confirmpassword"
            name="confirmpassword"
            placeholder={
              props?.["TYPE.PAGE.LOGIN.FORGET_PASS.REPASSWORD"]?.SHORT_LABEL
            }
            label={
              props?.["TYPE.PAGE.LOGIN.FORGET_PASS.REPASSWORD"]?.SHORT_LABEL
            }
            type={passConfirmVisible ? "text" : "password"}
            value={formik.values.confirmpassword}
            onChange={formik.handleChange}
            error={
              formik.touched.confirmpassword &&
              Boolean(formik.errors.confirmpassword)
            }
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setPassConfirmVisible(!passConfirmVisible);
                  }}
                >
                  {passConfirmVisible ? (
                    <VisibilityOffOutlinedIcon />
                  ) : (
                    <VisibilityOutlinedIcon />
                  )}
                </InputAdornment>
              ),
            }}
          />
          {formik.errors.confirmpassword && formik.touched.confirmpassword ? (
            <Box
              sx={{
                color: "#B3261E",
                position: "absolute",
                typography: "subtitle2",
                paddingBottom: "10px",
              }}
            >
              {formik.errors.confirmpassword}
            </Box>
          ) : null}
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
              mt: 2,
            }}
          >
            {
              props?.["TYPE.PAGE.LOGIN.FORGET_PASS.CHANGE_PASSWORD"]
                ?.SHORT_LABEL
            }
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
