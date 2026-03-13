import React from "react";
import { useDispatch } from "react-redux";

import { Box } from "@mui/material";

import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import { myFacebookLogin } from "../../services/actions/auth";
import { setLoaderTrue } from "../../services/actions/loader";
import history from "../../routers/history";

function FacebookSocialAuth(props) {
  const dispatch = useDispatch();
  const { Element, isSignInPanel } = props;

  return (
    <FacebookLogin
      render={(renderProps) => (
        <Box onClick={renderProps.onClick}>{Element}</Box>
      )}
      appId="1531824097251400"
      fields="
            id,
            first_name,
            last_name,
            name,
            name_format,
            picture,
            short_name"
      callback={(response) => {
        dispatch(setLoaderTrue());
        dispatch(
          myFacebookLogin(
            response.accessToken,
            isSignInPanel ? "login" : "register"
          )
        ).then(() => {
          history.push("/");
        });
      }}
    />
  );
}

export default FacebookSocialAuth;
