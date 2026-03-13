import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Button, Grid, TextField } from "@mui/material";

import Start from "../../../layout/start/start";
import UtilsServices from "../../../services/api/page/utils/utils";
import { forget_password } from "../../../services/actions/auth";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [props, setProps] = React.useState({});
  React.useEffect(() => {
    async function myFunc() {
      let res = await UtilsServices.pageText("LOGIN_SCREEN", {
        CULTURE,
        PARENT: ["LOGIN_SCREEN.SIGN_IN"],
        ID: ["TYPE.PAGE.LOGIN.FORGET_PASS.SEND_MAIL"],
      });
      console.log(res);
      setProps(res.data);
    }
    myFunc();
  }, []);

  const validationSchema = yup.object({
    email: yup
      .string(props?.["TYPE.PAGE.LOGIN.ERROR.EMAIL"]?.SHORT_LABEL)
      .email(props?.["TYPE.PAGE.LOGIN.ERROR.EMAIL.VALID"]?.SHORT_LABEL)
      .required(props?.["TYPE.PAGE.LOGIN.ERROR.EMAIL.REQUIRED"]?.SHORT_LABEL),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(forget_password(values.email));
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
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <TextField
            fullWidth
            name="email"
            label={props?.["TYPE.PAGE.LOGIN.ERROR.EMAIL"]?.SHORT_LABEL}
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
            {props?.["TYPE.PAGE.LOGIN.FORGET_PASS.SEND_MAIL"]?.SHORT_LABEL}
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
