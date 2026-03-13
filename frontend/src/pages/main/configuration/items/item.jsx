import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";

import {
  ItemSperatorLineXL,
  PropLinkTabs,
  ComponentError,
  MyDivider,
  Breadcrumb,
} from "../../../../components";

import DrawerMenu from "../../../../layout/main/asset/treeViewMenu";

import Properties from "./properties/dataGrid";
import { cleanDataGridItemAndRows } from "../../../../services/actions/item/itemDataGrid";
import MyActionMenu from "./properties/actionMenu";
import DateBreak from "./properties/dateBreak";
import LinkEditor from "./link/linkEditor";
import LinkActionMenu from "./link/linkActionMenu";
import TreeMenu from "./treeMenu";
import { selectDrawerItem } from "../../../../services/actions/drawerMenu/drawerMenu";
import "../../../../assets/styles/page/item.scss";
import "../../../../assets/styles/layouts/template.scss";
const Item = ({ isHome }) => {
  const dispatch = useDispatch();
  const isLinksActive = useSelector(
    (state) => state.itemLinkEditor.isLinksActive
  );
  const shortLabel = useSelector(
    (state) => state.drawerMenu.selectedItem?.SHORT_LABEL
  );
  const CULTURE = useSelector((state) => state.lang.cultur);
  if (shortLabel) document.title = `Ligeia.ai | ${shortLabel}`;
  selectDrawerItem(shortLabel);
  React.useEffect(() => {
    if (isHome) {
      dispatch(cleanDataGridItemAndRows());
      dispatch({
        type: "SELECT_TREEVIEW_ITEM",
        payload: { selectedIndex: -3 },
      });
    }
  }, [isHome]);
  return (
    <React.Fragment>
      <DrawerMenu Element={<TreeMenu />} path="item" />

      <Grid
        item
        xs={12}
        className="template-container__body item-container__body"
      >
        <Breadcrumb withTreemMenu={true} />
        <ItemSperatorLineXL />
        <Grid
          container
          className="template-container__body__action-box item-container__body__action-box"
        >
          <Grid item className="template-container__body__action-box__icons">
            {isLinksActive ? <LinkActionMenu /> : <MyActionMenu />}
          </Grid>
          <MyDivider />
          <Grid item className="item-container__body__action-box__date-break">
            {isLinksActive ? <DateBreak props={true} /> : <DateBreak />}
          </Grid>
          <MyDivider />
        </Grid>

        <ItemSperatorLineXL />
        <Grid
          item
          xs={12}
          className="template-container__body__property-box item-container__body__property-box"
        >
          <ComponentError errMsg="Error">
            <PropLinkTabs
              MyProperties={<Properties></Properties>}
              MyLinks={<LinkEditor />}
            />
          </ComponentError>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Item;
