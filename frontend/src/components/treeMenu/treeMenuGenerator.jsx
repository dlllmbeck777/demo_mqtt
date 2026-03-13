import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { TreeMenu } from "./treeMenu";

import {
  loadTreeviewItem,
  selectTreeViewItem,
  cleanTreeview,
} from "../../services/actions/treeview/treeview";
import { setText } from "../../services/actions/searchBar";
const TreeMenuItems = ({
  path,
  textPath,
  historyPathLevel,
  afterLoadTreeMenu,
}) => {
  const dispatch = useDispatch();
  const CULTURE = useSelector((state) => state.lang.cultur);
  const filteredTreeItems = useSelector(
    (state) => state.treeview.filteredMenuItem
  );
  const selectedIndex = useSelector(
    (state) => state.treeview.selectedItem.selectedIndex
  );
  const selectFunc = (index) => {
    dispatch(selectTreeViewItem(index, textPath, historyPathLevel));
  };
  React.useEffect(() => {
    dispatch(loadTreeviewItem(path, textPath, afterLoadTreeMenu, CULTURE));
    return async () => {
      dispatch(await cleanTreeview());
      dispatch(setText(""));
    };
  }, [CULTURE]);
  return (
    <TreeMenu
      items={filteredTreeItems}
      selectFunc={selectFunc}
      selectedIndex={selectedIndex}
      primaryText={textPath}
    />
  );
};

export default TreeMenuItems;
