import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid } from "@mui/material";

import {
  Breadcrumb,
  ItemSperatorLineXL,
  PropLinkTabs,
} from "../../../../../components";
import DrawerMenu from "../../../../../layout/main/asset/treeViewMenu";
import ActionMenu from "./actionMenu";
import Properties from "../tagManager/propertiesEditor";

import {
  cleanAllTags,
  loadTagsLabel,
  cleanSaveValue,
} from "../../../../../services/actions/tags/tags";
import { selectTreeViewItem } from "../../../../../services/actions/treeview/treeview";
import { selectDrawerItem } from "../../../../../services/actions/drawerMenu/drawerMenu";
import "../../../../../assets/styles/layouts/template.scss";
import Menu from "./treemenu";
import TagCalcService from "../../../../../services/api/tagsCalc";
const Tags = ({ isHome }) => {
  document.title = `Ligeia.ai | Tag Calculated`;
  selectDrawerItem("Tag Calculated");
  const dispatch = useDispatch();
  const page = useSelector((state) => state.propLinkTap?.page);
  React.useEffect(() => {
    if (isHome) {
      dispatch(selectTreeViewItem(-3, "", 3));
      dispatch(cleanSaveValue());
    }
  }, [isHome]);
  React.useEffect(() => {
    dispatch(loadTagsLabel(TagCalcService));
    return () => {
      dispatch(cleanAllTags());
    };
  }, []);
  return (
    <React.Fragment>
      <DrawerMenu Element={<Menu />} path="tags" />
      <Grid
        item
        xs={12}
        className="template-container__body tag-manager-container__body"
      >
        <Breadcrumb withTreemMenu={true} />
        <ItemSperatorLineXL />
        <Grid
          container
          className="template-container__body__action-box template-container__body__action-box"
        >
          <ActionMenu />
        </Grid>
        <ItemSperatorLineXL />
        <Grid
          item
          xs={12}
          className="template-container__body__property-box tag-manager-container__body__property-box"
        >
          <PropLinkTabs
            MyProperties={<Properties service={TagCalcService} />}
            isLinkOpen={false}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Tags;
