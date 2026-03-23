import React from "react";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Grid, IconButton } from "@mui/material";

import {
  ItemSperatorLineXL,
  CollapsableMenu,
  Breadcrumb,
  ComponentError,
} from "../../../components";

import DrawerMenu from "../../../layout/main/asset/treeViewMenu";

import Tabs from "./tabs";
import { loadCollapseMenu } from "../../../services/actions/collapseMenu/collapseMenu";
import ItemLinkService from "../../../services/api/itemLink";
import { cleanTabs } from "../../../services/actions/overview/taps";
import { selectDrawerItem } from "../../../services/actions/drawerMenu/drawerMenu";
import HorizontalMenu from "./horizontalMenu";
import ProfileService from "../../../services/api/profile";
import "../../../assets/styles/page/overview/main.scss";
import "../../../assets/styles/layouts/template.scss";
const Overview = () => {
  const dispatch = useDispatch();
  const isActiveTabs = useSelector((state) => state.tapsOverview.isActive);
  const activeLayer = useSelector((state) => state.auth?.user?.active_layer);
  React.useEffect(() => {
    document.title = "Ligeia.ai | Overview";
    selectDrawerItem("Overview");
    dispatch(cleanTabs());
    dispatch(loadCollapseMenu(ItemLinkService.hierarchy));
    async function myFunc() {
      try {
        let res = await ProfileService.loadProfileSettings();
        if (res?.data?.[0]?.overview_orientation === "horizontal") {
          $(".overview-tree-menu").hide();
          $(".overview-container__horizontal-menu").show();
          setTimeout(() => {
            $(".overview-container__tab-box").css({
              height: "calc(100% - 44px)",
            });
          }, [1000]);
          return;
        }
      } catch {}

        $(".overview-tree-menu").show();
        $(".overview-container__horizontal-menu").hide();
        $(".overview-container__tab-box").css({ height: "100%" });
    }
    myFunc();
  }, [dispatch, activeLayer]);
  return (
    <React.Fragment>
      <Box className="overview-tree-menu">
        <DrawerMenu Element={<CollapsableMenu />} path="overview" />
      </Box>
      <Grid
        Grid
        item
        xs={12}
        className="overview-container template-container__body"
      >
        {/* <Breadcrumb withTreemMenu={true} /> */}
        {/* <ItemSperatorLineXL /> */}
        <Box className="overview-container__horizontal-menu">
          <Box className="overview-container__horizontal-menu__body">
            <HorizontalMenu />
            <ItemSperatorLineXL />
          </Box>
        </Box>
        <ComponentError errMsg="Error">
          {isActiveTabs ? <Tabs /> : <Box />}
        </ComponentError>
      </Grid>
    </React.Fragment>
  );
};

export default React.memo(Overview);
