import React from "react";

import GitHubLogin from "react-login-github";
import { useDispatch } from "react-redux";

import { myGithubLogin } from "../../services/actions/auth";
import { setLoaderTrue } from "../../services/actions/loader";
import history from "../../routers/history";
function GithubSocialAuth(props) {
  const dispatch = useDispatch();
  const { Element, isSignInPanel } = props;

  return (
    <GitHubLogin
      clientId="18aca4fc69e6c0c27eae"
      onSuccess={(response) => {
        dispatch(setLoaderTrue());
        dispatch(
          myGithubLogin(response.code, isSignInPanel ? "login" : "register")
        ).then(() => {
          history.push("/");
        });
      }}
      onFailure={(response) => {}}
    >
      {Element}
    </GitHubLogin>
  );
}
export default GithubSocialAuth;
