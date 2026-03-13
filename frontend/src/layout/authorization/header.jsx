import React from "react";

import { Grid, Link } from "@mui/material";

import history from "../../routers/history";

const header = (props) => {
  const { isSignInPanel, signInText, signUpText } = props;
  return (
    <Grid
      container
      sx={{
        width: "100%",
        alignItems: "center",
      }}
    >
      <Grid
        item
        xs={6}
        sx={{
          textAlign: "center",
          borderWidth: "0px",
          paddingBottom: "5px",
          borderBottomWidth: "1px",
          borderColor: isSignInPanel ? "text.primary" : "text.secondary",
          borderStyle: "solid",
        }}
      >
        <Link
          underline="none"
          sx={{
            typography: "body2",
            width: "100%",
            cursor: "pointer",
            color: isSignInPanel ? "text.primary" : "text.secondary",
            opacity: isSignInPanel ? "1" : "0.6",
            fontWeight: "700",
          }}
          onClick={() => history.push("/signin")}
        >
          {signInText}
        </Link>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{
          textAlign: "center",
          borderWidth: "0px",
          paddingBottom: "5px",
          borderBottomWidth: "1px",
          borderColor: isSignInPanel ? "text.secondary" : "text.primary",
          borderStyle: "solid",
          opacity: isSignInPanel ? "0.6" : "1",
        }}
      >
        <Link
          underline="none"
          sx={{
            typography: "body2",
            width: "100%",
            cursor: "pointer",
            color: isSignInPanel ? "text.secondary" : "text.primary",
            fontWeight: "700",
          }}
          onClick={() => history.push("/signup")}
        >
          {signUpText}
        </Link>
      </Grid>
    </Grid>
  );
};

export default header;
