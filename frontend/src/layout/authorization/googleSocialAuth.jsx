import React, { useEffect } from "react";

import { Box } from "@mui/material";

import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";

import { myGoogleLogin } from "../../services/actions/auth";
import { useDispatch } from "react-redux";

import history from "../../routers/history";
import { setLoaderTrue } from "../../services/actions/loader";

function GoogleSocialAuth(props) {
  const dispatch = useDispatch();
  const { Element, isSignInPanel } = props;
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId:
          "491001574499-4ppnfldsim578soko2qp1o96seorjhgo.apps.googleusercontent.com",
        scope: "email",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  return (
    <GoogleLogin
      clientId="491001574499-4ppnfldsim578soko2qp1o96seorjhgo.apps.googleusercontent.com"
      render={(renderProps) => (
        <Box onClick={renderProps.onClick}>{Element}</Box>
      )}
      onSuccess={(response) => {
        dispatch(setLoaderTrue());
        dispatch(
          myGoogleLogin(response, isSignInPanel ? "login" : "register")
        ).then(() => {
          history.push("/");
        });
      }}
      onFailure={(response) => {
        console.log("google auth fail");
      }}
    />
  );
}

export default GoogleSocialAuth;
