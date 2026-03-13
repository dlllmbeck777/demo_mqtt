import React from "react";
import { Grid, Box } from "@mui/material";

import {
  Breadcrumb,
  ItemSperatorLineXL,
  ComponentError,
} from "../../../../components";
import { selectDrawerItem } from "../../../../services/actions/drawerMenu/drawerMenu";
import DrawerMenu from "../../../../layout/main/asset/treeViewMenu";
import TreeMenu from "./treeMenu";
import ProfileRouter from "./profileRouter";
import "../../../../assets/styles/page/administration/profile/profile.scss";
import "../../../../assets/styles/layouts/template.scss";
const Main = () => {
  document.title = "Ligeia.ai | Profile";
  selectDrawerItem("Profile");

  return (
    <React.Fragment>
      <DrawerMenu Element={<TreeMenu />} path="profile" delSearchBar={true} />
      <Box className="template-container__body">
        <Breadcrumb withTreemMenu={true} />
        <ItemSperatorLineXL />
        <Grid item xs={12} className="profile-container__body">
          <ComponentError errMsg="Error">
            <ProfileRouter />
          </ComponentError>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default Main;
