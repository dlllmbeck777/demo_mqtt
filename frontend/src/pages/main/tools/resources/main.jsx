import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Box, Grid } from "@mui/material";

import {
  Breadcrumb,
  ItemSperatorLineXL,
  ComponentError,
  PropLinkTabs,
  TreeMenuItems,
} from "../../../../components";
import DrawerMenu from "../../../../layout/main/asset/treeViewMenu";

import MyActionMenu from "./actionMenu";
import DataGridPro from "./datagrid";

import { filterMenu } from "../../../../services/actions/treeview/treeview";
import ResourcelistService from "../../../../services/api/resourceList";
import { useIsMount } from "../../../../hooks/useIsMount";
import { selectDrawerItem } from "../../../../services/actions/drawerMenu/drawerMenu";
import "../../../../assets/styles/page/tools/resourcelist/resourcelist.scss";
import { checkLastOpenItem } from "../../../../services/actions/resource/datagridResource";
import { cleanAllValues } from "../../../../services/actions/datagrid/utils";
import { cleanDatagrid } from "../../../../services/actions/datagrid/datagrid";
const Menu = () => {
  document.title = `Ligeia.ai | Resources`;
  selectDrawerItem("Resources");
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const text = useSelector((state) => state.searchBar.text);
  const culture = useSelector((state) => state.lang.cultur);
  React.useEffect(() => {
    if (!isMount) {
      const body = JSON.stringify({
        PARENT: text,
        CULTURE: culture,
      });
      dispatch(filterMenu(text, ResourcelistService.elasticSearch, body));
    }
  }, [text]);

  return (
    <TreeMenuItems
      path={ResourcelistService.getAllTreeitem}
      textPath="PARENT"
      historyPathLevel={2}
      afterLoadTreeMenu={checkLastOpenItem}
    />
  );
};

const ResourceList = ({ isHome }) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (isHome) {
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
      <DrawerMenu Element={<Menu />} path="resources" />

      <Box className="resource-list-container__body">
        <Breadcrumb withTreemMenu={true} />
        <ItemSperatorLineXL />
        <Grid container className="resource-list-container__body__action-box">
          <Grid
            item
            className="resource-list-container__body__action-box__icons"
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
          className="resource-list-container__body__property-box"
        >
          <ComponentError errMsg="Error">
            <PropLinkTabs MyProperties={<DataGridPro />} isLinkOpen={false} />
          </ComponentError>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default React.memo(ResourceList);
