import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Avatar, Grid } from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

import * as Icons from "@mui/icons-material";
import { selectPage } from "../../../../services/actions/profile/profile";
import "../../../../assets/styles/page/administration/profile/treemenu.scss";

const Pages = React.memo(() => {
  const dispatch = useDispatch();
  const selectedPage = useSelector((state) => state.profile.selectedPage);
  const pages = {
    "Personal Information": "PersonOutline",
    "Change Password": "Https",
    Settings: "Settings",
  };
  function handleClick(page) {
    dispatch(selectPage(page));
  }
  return (
    <Box className="profile-treemenu__pages">
      {Object.keys(pages).map((e, i) => {
        const { [pages[e]]: Icon } = Icons;
        return (
          <Box
            className={`profile-treemenu__pages__element ${
              selectedPage === e && "profile-treemenu__pages__element__selected"
            } `}
            key={i}
            onClick={() => handleClick(e)}
          >
            <Icon className="profile-treemenu__pages__element__icon" />
            <Box className="profile-treemenu__pages__element__text">{e}</Box>
          </Box>
        );
      })}
    </Box>
  );
});

const TreeMenu = () => {
  const userName = useSelector((state) => state.auth?.user?.first_name);
  const userLastName = useSelector((state) => state.auth?.user?.last_name);
  const role = useSelector((state) => state.auth?.user?.role?.ROLES_NAME);
  const project = useSelector((state) => state.auth?.user?.layer_name.length);
  const twitter = useSelector((state) => state.auth?.user?.twitter);
  const facebook = useSelector((state) => state.auth?.user?.facebook);
  const linkedin = useSelector((state) => state.auth?.user?.linkedin);
  return (
    <Box className="profile-treemenu">
      <Box className="profile-treemenu__avatar-box">
        <Avatar className="profile-treemenu__avatar-box__avatar" />
      </Box>
      <Box className="profile-treemenu__name">
        {userName + " " + userLastName}
      </Box>
      <Box className="profile-treemenu__role">{role}</Box>
      <Grid container columnSpacing={2} className="profile-treemenu__icons">
        <Grid item>
          <a href={twitter}>
            <TwitterIcon sx={{ color: "#00acee" }} fontSize="large" />
          </a>
        </Grid>
        <Grid item>
          <a href={facebook}>
            <FacebookIcon sx={{ color: "#3b5998" }} fontSize="large" />
          </a>
        </Grid>
        <Grid item>
          <a href={linkedin}>
            <LinkedInIcon sx={{ color: "#0072b1" }} fontSize="large" />
          </a>
        </Grid>
      </Grid>
      <Box className="profile-treemenu__project">
        <Box className="profile-treemenu__project__box">
          <Box className="profile-treemenu__project__box__num">{project}</Box>
          <Box className="profile-treemenu__project__box__text">Project</Box>
        </Box>
      </Box>
      <Pages />
    </Box>
  );
};

export default React.memo(TreeMenu);
