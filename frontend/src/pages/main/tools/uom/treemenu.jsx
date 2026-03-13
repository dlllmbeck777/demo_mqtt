import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { TreeMenuItems } from "../../../../components";

import {
  loadTreeviewItem,
  cleanTreeview,
  filterMenu,
} from "../../../../services/actions/treeview/treeview";

import { checkLastOpenItem } from "../../../../services/actions/uom/uom";

import { useIsMount } from "../../../../hooks/useIsMount";
import UomService from "../../../../services/api/uom";

const TreeMenu = () => {
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const text = useSelector((state) => state.searchBar.text);
  const CULTURE = useSelector((state) => state.lang.cultur);
  React.useEffect(() => {
    if (!isMount) {
      dispatch(
        loadTreeviewItem(pathFunction, "QUANTITY_TYPE", () => () => {}, CULTURE)
      );
    }
    return async () => {
      dispatch(await cleanTreeview());
    };
  }, []);

  React.useEffect(() => {
    if (!isMount) {
      const body = JSON.stringify({
        CULTURE,
      });
      dispatch(filterMenu(text, UomService.elasticSearch, body));
    }
  }, [text]);

  const pathFunction = async (body, cancelToken) => {
    return await UomService.getAll(body, cancelToken);
  };

  return (
    <TreeMenuItems
      path={pathFunction}
      textPath="QUANTITY_TYPE"
      historyPathLevel={2}
      afterLoadTreeMenu={checkLastOpenItem}
    />
  );
};

export default React.memo(TreeMenu);
