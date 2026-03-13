import React from "react";
import { Box, Grid, Typography } from "@mui/material";

import Header from "./header";
import Social from "./social";

const layout = (props) => {
  const { Element, isSignInPanel, rest } = props;
  return (
    <Grid
      container
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: { xs: "calc(100vh - 250px)", sm: "calc(100vh - 200px)" },
        minHeight: "549px",
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
        <Header
          isSignInPanel={isSignInPanel}
          signInText={rest?.["TYPE.PAGE.LOGIN.SIGN_IN"]?.SHORT_LABEL}
          signUpText={rest?.["TYPE.PAGE.LOGIN.SIGN_UP"]?.SHORT_LABEL}
        />
        <Box sx={{ height: "44px" }} />
        <Social isSignInPanel={isSignInPanel} />
        <Typography
          sx={{
            typography: "body2",
            marginY: "28px",
            textAlign: "center",
            opacity: "0.4",
            color: "text.primary",
            fontWeight: "700",
          }}
        >
          {rest?.["TYPE.PAGE.LOGIN.OR"]?.SHORT_LABEL}
        </Typography>
        <Element rest={rest} />
      </Grid>
    </Grid>
  );
};

export default layout;
