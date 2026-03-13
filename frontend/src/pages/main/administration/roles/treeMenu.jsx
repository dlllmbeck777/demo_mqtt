import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { TreeMenuItems } from "../../../../components";

import { useIsMount } from "../../../../hooks/useIsMount";
import Roles from "../../../../services/api/roles";
import { checkLastOpenItem } from "../../../../services/actions/roles/properties";
import { filterMenu } from "../../../../services/actions/treeview/treeview";
const TreeMenu = () => {
  const dispatch = useDispatch();
  const isMount = useIsMount();
  const text = useSelector((state) => state.searchBar.text);
  const layer = useSelector((state) => state.auth.user.active_layer);
  React.useEffect(() => {
    if (!isMount) {
      const body = JSON.stringify({
        PROPERTY_STRING: text,
        LAYER_NAME: layer,
      });
      dispatch(filterMenu(text, Roles.elasticSearch, body));
    }
  }, [text]);

  return (
    <TreeMenuItems
      path={Roles.getAll}
      textPath="ROLES_NAME"
      historyPathLevel={2}
      afterLoadTreeMenu={checkLastOpenItem}
    />
  );
};

export default React.memo(TreeMenu);
