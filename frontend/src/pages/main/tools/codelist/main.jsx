import React from "react";
import { useDispatch } from "react-redux";

import { Grid, Box } from "@mui/material";

import {
  Breadcrumb,
  ItemSperatorLineXL,
  ComponentError,
  PropLinkTabs,
} from "../../../../components";
import DrawerMenu from "../../../../layout/main/asset/treeViewMenu";

import MyActionMenu from "./actionMenu";
import DataGridPro from "./datagrid";

import { selectTreeViewItem } from "../../../../services/actions/treeview/treeview";
import { cleanAllValues } from "../../../../services/actions/datagrid/utils";
import { cleanDatagrid } from "../../../../services/actions/datagrid/datagrid";
import Menu from "./treeMenu";
import { selectDrawerItem } from "../../../../services/actions/drawerMenu/drawerMenu";
import "../../../../assets/styles/page/tools/codelist/codelist.scss";
import "../../../../assets/styles/layouts/template.scss";
const CodeList = ({ isHome }) => {
  document.title = `Ligeia.ai | Code List`;
  selectDrawerItem("Code List");
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (isHome) {
      dispatch(selectTreeViewItem(-3, "", 3));
      dispatch(cleanAllValues());
    }
  }, [isHome]);

  React.useEffect(() => {
    return () => {
      dispatch(cleanDatagrid());
    };
  }, []);

  return (
    <React.Fragment>
      <DrawerMenu Element={<Menu />} path="codelist" />

      <Box className="template-container__body">
        <Breadcrumb withTreemMenu={true} />
        <ItemSperatorLineXL />
        <Grid
          container
          className="template-container__body__action-box code-list-container__body__action-box"
        >
          <Grid
            item
            className="template-container__body__actions-box-icons code-list-container__body__action-box__icons"
          >
            <ComponentError errMsg="Error">
              <MyActionMenu />
            </ComponentError>
          </Grid>
        </Grid>
        <ItemSperatorLineXL />
        <Grid
          item
          xs={12}
          className="template-container__body__property-box code-list-container__body__property-box"
        >
          <ComponentError errMsg="Error">
            <PropLinkTabs MyProperties={<DataGridPro />} isLinkOpen={false} />
          </ComponentError>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default React.memo(CodeList);
