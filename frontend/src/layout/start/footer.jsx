import React from "react";
import { Grid, Typography } from "@mui/material";

import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import logo from "../../assets/Images/socialmedia/logo.png";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";

import PrivacyPolicy from "../privacyPolicy";
import "../../assets/styles/page/starter/footer.scss";
const Footer = () => {
  return (
    <Grid container rowGap={1} className="starter-container__footer">
      <Grid item>
        <Typography className="starter-container__footer__text">
          © 2022 Ligeia.ai. All rights Reserved <br />
          <PrivacyPolicy />| Legal Stuff
        </Typography>
      </Grid>
      <Grid item>
        <Grid
          container
          columnGap={4}
          className="starter-container__footer__icon-group"
        >
          <Grid item>
            <img src={logo} alt="logo" style={{ fill: "#ffffff" }} />
          </Grid>
          <Grid item>
            <TwitterIcon />
          </Grid>
          <Grid item>
            <InstagramIcon />
          </Grid>
          <Grid item>
            <PinterestIcon />
          </Grid>
          <Grid item>
            <GitHubIcon />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Footer;
