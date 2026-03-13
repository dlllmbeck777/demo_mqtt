import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import { useIsMount } from "../../../../../hooks/useIsMount";
import { setIsActiveLink } from "../../../../../services/actions/item/itemLinkEditor";

import {
  setBodyConfirmation,
  setSaveFunctonConfirmation,
  setTitleConfirmation,
} from "../../../../../services/actions/confirmation/historyConfirmation";

import { saveItemLink } from "../../../../../services/actions/item/itemLinkEditor";

import ItemLinks from "./itemLinks";
const LinkEditor = () => {
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const name = useSelector(
    (state) => state.treeview.selectedItem.PROPERTY_STRING
  );
  React.useEffect(() => {
    dispatch(setIsActiveLink(true));
    return () => {
      dispatch(setIsActiveLink(false));
    };
  }, []);
  React.useEffect(() => {
    if (isMount) {
      dispatch(setSaveFunctonConfirmation(saveItemLink));
      dispatch(setTitleConfirmation("Are you sure you want to save this ? "));
      dispatch(setBodyConfirmation(`${name ? name : "new"}`));
    }
  }, [selectedIndex]);
  if (name) {
    return (
      <Grid container className="item-container__body__property-box__links">
        <Grid item xs={12} md={6}>
          <Box
            container
            className="item-container__body__property-box__links__in-out"
          >
            In
          </Box>
          <ItemLinks
            itemType={"linkEditorSchema"}
            connection={"TO_ITEM_ID"}
            type={"TO_TYPE"}
          />
        </Grid>
        <Divider className="item-container__body__property-box__links__divider" />
        <Grid item xs={12} md={6}>
          <Box className="item-container__body__property-box__links__in-out">
            Out
          </Box>
          <ItemLinks
            itemType={"linkEditorSchemaFromType"}
            connection={"FROM_ITEM_ID"}
            type={"FROM_TYPE"}
          />
        </Grid>
      </Grid>
    );
  }
  return <></>;
};

export default LinkEditor;
