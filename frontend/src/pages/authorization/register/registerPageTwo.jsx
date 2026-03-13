import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";

import {
  Button,
  Checkbox,
  Grid,
  FormControlLabel,
  FormGroup,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import history from "../../../routers/history";

import Layout from "../../../layout/authorization/layout";

import { signup } from "../../../services/actions/auth";
import { setFirstLastName } from "../../../services/reducers/registerFormReducer";
import { setLoaderTrue } from "../../../services/actions/loader";
import { add_error } from "../../../services/actions/error";
import UtilsServices from "../../../services/api/page/utils/utils";
const MyBody = ({ rest }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.registerForm);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      isAgree: userData.isAgree,
    },

    onSubmit: async (values) => {
      dispatch(
        setFirstLastName({
          firstname: values.firstname,
          lastname: values.lastname,
          isAgree: values.isAgree,
        })
      );
      dispatch(setLoaderTrue());
      let res = await dispatch(
        signup(
          userData.email,
          values.firstname,
          values.lastname,
          userData.password,
          values.isAgree
        )
      );
      if (res) history.push(`/`);
    },
  });

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <TextField
          fullWidth
          name="firstname"
          label={rest?.["TYPE.PAGE.LOGIN.FIRST_NAME"]?.SHORT_LABEL}
          value={formik.values.firstname}
          onChange={formik.handleChange}
        />
        <TextField
          fullWidth
          name="lastname"
          placeholder={rest?.["TYPE.PAGE.LOGIN.LAST_NAME"]?.SHORT_LABEL}
          label={rest?.["TYPE.PAGE.LOGIN.LAST_NAME"]?.SHORT_LABEL}
          value={formik.values.lastname}
          onChange={formik.handleChange}
          sx={{ mt: 2 }}
        />
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

const RegisterPageTwo = () => {
  const CULTURE = useSelector((state) => state.lang.cultur);
  const [props, setProps] = React.useState({});
  React.useEffect(() => {
    async function myFunc() {
      let res = await UtilsServices.pageText("LOGIN_SCREEN", {
        CULTURE,
        PARENT: ["LOGIN_SCREEN.SIGN_IN", "LOGIN_SCREEN.SIGN_UP"],
      });
      setProps(res.data);
    }
    myFunc();
  }, []);
  return <Layout Element={MyBody} rest={props} isSignInPanel={false} />;
};

export default RegisterPageTwo;
