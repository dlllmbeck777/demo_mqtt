import React from "react";
import { useDispatch } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
  ItemSperatorLineXL,
  PropLinkTabs,
  ComponentError,
  Breadcrumb,
} from "../../../../components";

import DrawerMenu from "../../../../layout/main/asset/treeViewMenu";

import DataGrid from "./properties/dataGrid";
import MyActionMenu from "./properties/actionMenu";
import TreeMenu from "./treeMenu";

import { cleanRoles } from "../../../../services/actions/roles/roles";
import { selectDrawerItem } from "../../../../services/actions/drawerMenu/drawerMenu";
import "../../../../assets/styles/page/administration/roles/roles.scss";
import "../../../../assets/styles/layouts/template.scss";
import { cleanDatagrid } from "../../../../services/actions/datagrid/datagrid";
const Main = ({ isHome }) => {
  document.title = "Ligeia.ai | Roles";
  selectDrawerItem("Roles");
  const dispatch = useDispatch();
  React.useEffect(() => {
    return () => {
      dispatch(cleanRoles());
      dispatch(cleanDatagrid());
    };
  }, []);
  return (
    <React.Fragment>
      <DrawerMenu Element={<TreeMenu />} path="item" />

      <Box className="template-container__body roles-container__body">
        <Breadcrumb withTreemMenu={true} />
        <ItemSperatorLineXL />
        <Grid container className=" template-container__body__action-box ">
          <Grid item className="template-container__body__action-box__icons">
            <ComponentError errMsg="Error">
              <MyActionMenu />
            </ComponentError>
          </Grid>
        </Grid>

        <ItemSperatorLineXL />
        <Grid
          item
          xs={12}
          className=" template-container__body__property-box roles-container__body__property-box"
        >
          <ComponentError errMsg="Error">
            <PropLinkTabs
              MyProperties={<DataGrid isHome={isHome} />}
              isLinkOpen={false}
            />
          </ComponentError>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default Main;
