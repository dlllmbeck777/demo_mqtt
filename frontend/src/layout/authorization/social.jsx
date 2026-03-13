import React from "react";

import { Grid } from "@mui/material";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

import { SocialButton } from "../../components";
import FacebookSocialAuth from "./faceSocialAuth";
import GoogleSocialAuth from "./googleSocialAuth";
import GitHubSocialAuth from "./githubSocialAuth";

const social = ({ isSignInPanel }) => {
  return (
    <Grid container spacing={1} sx={{ justifyContent: "center" }}>
      <Grid item>
        <FacebookSocialAuth
          Element={
            <SocialButton
              Logo={FacebookRoundedIcon}
              isSignInPanel={isSignInPanel}
            />
          }
          isSignInPanel={isSignInPanel}
        />
      </Grid>
      <Grid item>
        <GoogleSocialAuth
          Element={<SocialButton Logo={GoogleIcon} />}
          isSignInPanel={isSignInPanel}
        />
      </Grid>
      <Grid
        item
        sx={{
          button: {
            backgroundColor: "inherit",
            border: "none",
          },
        }}
      >
        <GitHubSocialAuth
          Element={<SocialButton Logo={GitHubIcon} />}
          isSignInPanel={isSignInPanel}
        />
      </Grid>
    </Grid>
  );
};

export default social;
