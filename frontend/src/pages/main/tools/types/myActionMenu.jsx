import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ActionMenu } from "../../../../components";

import {
  deleteType,
  refreshDataGridType,
  cleanAllDataGrid,
} from "../../../../services/actions/type/datagrid";
import { selectTreeViewItem } from "../../../../services/actions/treeview/treeview";
import { confirmationPushHistory } from "../../../../services/utils/historyPush";
const TypeActionMenu = () => {
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const dispatch = useDispatch();
  const btnNew = () => {
    dispatch(selectTreeViewItem(-2, "new", 2));
  };
  const saveGoPrev = () => {
    dispatch(selectTreeViewItem(selectedIndex - 1, "TYPE", 2));
  };
  const saveGoNext = () => {
    dispatch(selectTreeViewItem(selectedIndex + 1, "TYPE", 2));
  };
  const save = () => {
    dispatch(confirmationPushHistory());
  };

  const btnDelete = () => {
    dispatch(deleteType());
  };

  const onRefreshClick = () => {
    dispatch(cleanAllDataGrid());
    dispatch(refreshDataGridType());
  };
  return (
    <ActionMenu
      dublicateIsActive={false}
      infoIsActive={false}
      btnNew={btnNew}
      save={save}
      btnDelete={btnDelete}
      saveGoPrev={saveGoPrev}
      saveGoNext={saveGoNext}
      refresh={onRefreshClick}
    />
  );
};

export default TypeActionMenu;
