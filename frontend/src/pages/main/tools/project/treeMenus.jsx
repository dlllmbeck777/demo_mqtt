import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { TreeMenuItems } from "../../../../components";

import {
  loadTreeviewItem,
  cleanTreeview,
} from "../../../../services/actions/treeview/treeview";

import { useIsMount } from "../../../../hooks/useIsMount";
import ProjectService from "../../../../services/api/project";
import { filterMenu } from "../../../../services/actions/treeview/treeview";
import { checkLastOpenItem } from "../../../../services/actions/project/project";
const TreeMenu = () => {
  const isMount = useIsMount();
  const dispatch = useDispatch();
  const text = useSelector((state) => state.searchBar.text);
  const layer = useSelector((state) => state.auth.user.active_layer);
  const CULTURE = useSelector((state) => state.lang.cultur);
  React.useEffect(() => {
    if (!isMount) {
      dispatch(
        loadTreeviewItem(pathFunction, "LAYER_NAME", () => () => {}, CULTURE)
      );
    }
    return async () => {
      dispatch(await cleanTreeview());
    };
  }, []);
  React.useEffect(() => {
    if (!isMount) {
      const body = JSON.stringify({
        PROPERTY_STRING: text,
        LAYER_NAME: layer,
      });
      dispatch(filterMenu(text, ProjectService.elasticSearch, body));
    }
  }, [text]);
  const pathFunction = async (body, cancelToken) => {
    return await ProjectService.getAll(body, cancelToken);
  };

  return (
    <TreeMenuItems
      path={pathFunction}
      textPath="LAYER_NAME"
      historyPathLevel={2}
      afterLoadTreeMenu={checkLastOpenItem}
    />
  );
};

export default React.memo(TreeMenu);
