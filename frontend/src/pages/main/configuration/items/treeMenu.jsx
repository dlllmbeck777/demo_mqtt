import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { TreeMenuItems } from "../../../../components";

import {
  loadTreeviewItem,
  cleanTreeview,
  filterMenu,
} from "../../../../services/actions/treeview/treeview";
import ItemService from "../../../../services/api/item";

import { useIsMount } from "../../../../hooks/useIsMount";
import {
  loadTypeRowsDataGrid,
  cleanDataGrid,
  checkLastOpenItem,
  loadColumns,
} from "../../../../services/actions/item/itemDataGrid";

import { loadItemLinkSchema } from "../../../../services/actions/item/itemLinkEditor";

const TreeMenu = () => {
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const type = useSelector((state) => state.drawerMenu.selectedItem?.TYPE);
  const layer = useSelector((state) => state.auth.user.active_layer);
  const text = useSelector((state) => state.searchBar.text);
  const CULTURE = useSelector((state) => state.lang.cultur);
  React.useEffect(() => {
    async function myFunc() {
      if (!isMount) {
        await dispatch(
          loadTreeviewItem(
            pathFunction,
            "PROPERTY_STRING",
            () => () => {},
            CULTURE
          )
        );
      }
      dispatch(loadColumns());
      dispatch(loadTypeRowsDataGrid());
      dispatch(loadItemLinkSchema());
      dispatch(checkLastOpenItem());
    }
    myFunc();
    return async () => {
      dispatch(await cleanTreeview());
      dispatch(cleanDataGrid());
    };
  }, [type, CULTURE]);

  React.useEffect(() => {
    if (!isMount) {
      const body = JSON.stringify({
        PROPERTY_STRING: text,
        LAYER_NAME: layer,
      });
      dispatch(filterMenu(text, ItemService.elasticSearch, body));
    }
  }, [text]);
  const pathFunction = async (body, cancelToken) => {
    return await ItemService.getAll(body, cancelToken, type);
  };

  return (
    <TreeMenuItems
      path={pathFunction}
      textPath="PROPERTY_STRING"
      historyPathLevel={3}
    />
  );
};

export default React.memo(TreeMenu);
