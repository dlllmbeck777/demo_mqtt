import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionMenu } from "../../../../../components";

import { setConfirmation } from "../../../../../services/reducers/confirmation";

import { selectTreeViewItem } from "../../../../../services/actions/treeview/treeview";
import { setIsActiveConfirmation } from "../../../../../services/actions/confirmation/historyConfirmation";
import { deleteItem } from "../../../../../services/actions/item/itemDataGrid";
import {
  saveItemLink,
  refreshLinks,
} from "../../../../../services/actions/item/itemLinkEditor";
const LinkActionMenu = () => {
  const isChanged = useSelector((state) => state.historyConfirmation.isActive);
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const name = useSelector(
    (state) => state.treeview.selectedItem.PROPERTY_STRING
  );
  const dispatch = useDispatch();
  const save = () => {
    if (isChanged) {
      dispatch(
        setConfirmation({
          title: "Are you sure you want to save this ?",
          body: `${name ? name : "new"}`,
          agreefunction: async () => {
            dispatch(saveItemLink());
            dispatch(setIsActiveConfirmation(false));
          },
        })
      );
    }
  };

  const btnDelete = () => {
    dispatch(
      setConfirmation({
        title: "Are you sure you want to delete this ?",
        body: `${name ? name : "new"}`,
        agreefunction: () => {
          dispatch(deleteItem());
          dispatch(setIsActiveConfirmation(false));
        },
      })
    );
  };

  const saveGoPrev = () => {
    dispatch(selectTreeViewItem(selectedIndex - 1, "PROPERTY_STRING", 3));
  };

  const saveGoNext = () => {
    dispatch(selectTreeViewItem(selectedIndex + 1, "PROPERTY_STRING", 3));
  };
  const onRefreshClick = () => {
    dispatch(refreshLinks());
  };

  return (
    <ActionMenu
      dublicateIsActive={false}
      infoIsActive={false}
      btnNewIsDisabled={true}
      save={save}
      btnDelete={btnDelete}
      saveGoPrev={saveGoPrev}
      saveGoNext={saveGoNext}
      refresh={onRefreshClick}
    />
  );
};

export default LinkActionMenu;
